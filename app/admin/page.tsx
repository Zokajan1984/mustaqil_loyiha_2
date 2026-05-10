// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]); // список заказов
  const [loading, setLoading] = useState(true); // загрузка

  // загружаем заказы при открытии страницы
  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await ordersApi.get("/orders"); // GET все заказы
      // сортируем по дате (новые сверху)
      const sorted = res.data.sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOrders(sorted);
    } catch (e) {
      toast.error("Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  }

  // обновляем статус заказа
  async function updateStatus(id: string, status: Order["status"]) {
    try {
      await ordersApi.put(`/orders/${id}`, { status }); // PUT обновляем только статус
      toast.success("Статус обновлён");
      loadOrders(); // перезагружаем список
    } catch (e) {
      toast.error("Ошибка обновления");
    }
  }

  // цвет бейджа по статусу
  function statusColor(s: string) {
    switch (s) {
      case "new":
        return "default";
      case "cooking":
        return "secondary";
      case "delivered":
        return "outline";
      default:
        return "default";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadOrders}>
              Обновить
            </Button>
            <Link href="/">
              <Button>На сайт</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Заказ #{order.id} — {order.customerName}
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        {order.phone} • {order.address}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleString("ru-RU")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusColor(order.status) as any}>
                        {order.status === "new"
                          ? "Новый"
                          : order.status === "cooking"
                            ? "Готовится"
                            : "Доставлен"}
                      </Badge>
                      <Select
                        value={order.status}
                        onValueChange={(v) =>
                          updateStatus(order.id!, v as Order["status"])
                        }
                      >
                        <SelectTrigger className="w-">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новый</SelectItem>
                          <SelectItem value="cooking">Готовится</SelectItem>
                          <SelectItem value="delivered">Доставлен</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Пицца</TableHead>
                        <TableHead>Кол-во</TableHead>
                        <TableHead>Цена</TableHead>
                        <TableHead>Сумма</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{Number(item.price)} сум</TableCell>
                          <TableCell>
                            {Number(item.price) * item.quantity} сум
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Итого:
                        </TableCell>
                        <TableCell className="font-bold">
                          {order.total} сум
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}

            {orders.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-slate-600">
                  Заказов пока нет
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
