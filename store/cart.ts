// store/cart.ts
import { create } from "zustand"; // создаём store
import { persist } from "zustand/middleware"; // сохраняем в localStorage
import { CartItem, Product } from "@/types"; // наши типы
import toast from "react-hot-toast"; // уведомления

interface CartState {
  // описываем что храним
  items: CartItem[]; // массив товаров
  addItem: (product: Product) => void; // добавить товар
  removeItem: (id: string) => void; // удалить
  updateQty: (id: string, qty: number) => void; // изменить количество
  clear: () => void; // очистить корзину
  total: () => number; // посчитать сумму
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], // начальное значение — пусто

      addItem: (product) => {
        const items = get().items; // получаем текущие товары
        const exist = items.find((i) => i.id === product.id); // ищем такой же

        if (exist) {
          // если есть — увеличиваем количество на 1
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          // если нет — добавляем новый товар с quantity 1
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
        toast.success(`${product.name} добавлена`); // показываем тост
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) }); // убираем по id
        toast("Удалено из корзины"); // уведомление
      },

      updateQty: (id, qty) => {
        if (qty < 1) return; // защита от 0 и меньше
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i,
          ),
        });
      },

      clear: () => set({ items: [] }), // очистка

      total: () => {
        // считаем сумму: цена * количество для каждого
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    { name: "pizza-cart" }, // ключ в localStorage
  ),
);
