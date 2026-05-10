"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Category, Product } from "@/types";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { log } from "console";

export default function Home() {
  const [categories, setCategoris] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);
        setCategoris(catRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = selectedCat
    ? products.filter((p) => p.categaryId === selectedCat)
    : products;

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 bg-white border-b z-100">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <h1 className="flex gap-4">
            <Link href="/cart">
              <Button variant={"outline"}>Корзина ({cartCount})</Button>
            </Link>

            <Link href="/admin">
              <Button variant="ghost">Админка</Button>
            </Link>
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-6 flex-wrap">
          <Badge
            className="coursor-pointer"
            variant={selectedCat === null ? "default" : "outline"}
            onClick={() => setSelectedCat(null)}
          >
            Все
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              className="cursor-pointer"
              variant={selectedCat === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCat(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>

        {loading && <p>Загрузка...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img
                  src={p.image || `https://picsum.photos/seed/${p.id}/600/400`}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // если картинка не загрузилась — подставляем заглушку
                    (e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/pizza${p.id}/600/400`;
                  }}
                />{" "}
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <p className="text-sm text-slate-600 mt-2">{p.description}</p>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <span className="font-bold text-xl">{p.price}сум</span>
                <Button onClick={() => addItem(p)}>В корзину</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
