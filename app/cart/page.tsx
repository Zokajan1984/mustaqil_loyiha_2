"use client";

import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ordersApi } from "@/lib/api";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { it } from "node:test";
import { log } from "console";
import { CgArrowLongLeft } from "react-icons/cg";

export default function CartPage() {
  const { items, updateQty, removeItem, total, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleOrder() {
    if (!name || !phone || !address) {
      toast.error("Заполните все поля");
      return;
    }
    if (items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }
    setLoading(true);

    try {
      await ordersApi.post("/orders", {
        customerName: name,
        phone,
        address,
        items,
        total: total(),
        status: "new",
        createdAt: new Date().toISOString(),
      });

      toast.success("Заказ оформлен!");
      clear();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Корзина</h1>
          <Link href={"/"}>
            <Button variant="outline">
              <CgArrowLongLeft />
              Назад в меню
            </Button>
          </Link>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="mb-4">Корзина пуста</p>
              <Link href={"/"}>
                <Button>Выбрать пиццу</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex gap-4">
                    <img
                      src={
                        item.image || `https://picsum.phots/seed/${item.id}/100`
                      }
                      className="w-20 h-20 rounded"
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-slate-600">
                        {Number(item.price)} сум × {item.quantity}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="px-2">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQty(item.id, item.quantity + 1)} // увеличить
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)} // удалить
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="text-right font-bold text-xl">
                Итого: {total()} сум
              </div>
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h2 className="font-bold text-lg">Оформление</h2>

                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // сохраняем имя
                    placeholder="Алишер"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Адрес доставки</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Самарканд, ул. ..."
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleOrder}
                  disabled={loading} // блокируем кнопку во время отправки
                >
                  {loading ? "Отправка..." : `Заказать за ${total()} сум`}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
