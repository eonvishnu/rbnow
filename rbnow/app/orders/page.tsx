
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartProvider";
import Link from "next/link";
import {
  ArrowLeft,
  Box,
  Bike,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Leaf,
  MapPin,
  Package,
  PhoneCall,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Truck,
  XCircle,
  AlertCircle,
} from "lucide-react";

type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "preparing"
  | "ready_for_delivery"
  | "out_for_delivery"
  | "partially_fulfilled"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "unverified"
  | "created"
  | "authorized"
  | "captured"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

type FulfillmentStatus =
  | "pending"
  | "packed"
  | "backordered"
  | "delivered"
  | "unavailable";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
  unit: string;
  img: string;
  fulfillmentStatus: FulfillmentStatus;
  promisedDate: string | null;
  fulfillmentNote: string | null;
}

interface CustomerOrder {
  id: string;
  orderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  deliveryAddress: any;
  deliveryDate: string | null;
  history: any[];
  items: OrderItem[];
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Payment not confirmed",
  confirmed: "Confirmed",
  processing: "Processing",
  preparing: "Preparing",
  ready_for_delivery: "Ready for delivery",
  out_for_delivery: "Out for delivery",
  partially_fulfilled: "Partially fulfilled",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const FULFILLMENT_LABELS: Record<FulfillmentStatus, string> = {
  pending: "Pending",
  packed: "Packed",
  backordered: "Awaiting stock",
  delivered: "Delivered",
  unavailable: "Unavailable",
};

const isActiveStatus = (status: OrderStatus) =>
  status !== "delivered" && status !== "cancelled";

const isPaymentPending = (status: OrderStatus) =>
  status === "pending_payment";

const isPaymentSuccessful = (status: PaymentStatus) =>
  status === "captured" || status === "paid";

const getOrderStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800";

    case "processing":
    case "preparing":
      return "bg-amber-100 text-amber-800";

    case "ready_for_delivery":
      return "bg-sky-100 text-sky-800";

    case "out_for_delivery":
      return "bg-indigo-100 text-indigo-800";

    case "partially_fulfilled":
      return "bg-orange-100 text-orange-800";

    case "delivered":
      return "bg-[#e5f5ef] text-[#006b50]";

    case "cancelled":
      return "bg-rose-100 text-rose-800";

    case "pending_payment":
    default:
      return "bg-rose-100 text-rose-800";
  }
};

const getFulfillmentStyle = (status: FulfillmentStatus) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-800";

    case "packed":
      return "bg-sky-100 text-sky-800";

    case "backordered":
      return "bg-amber-100 text-amber-800";

    case "unavailable":
      return "bg-rose-100 text-rose-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const allowed: OrderStatus[] = [
    "pending_payment",
    "confirmed",
    "processing",
    "preparing",
    "ready_for_delivery",
    "out_for_delivery",
    "partially_fulfilled",
    "delivered",
    "cancelled",
  ];

  return allowed.includes(value as OrderStatus)
    ? (value as OrderStatus)
    : "confirmed";
};

const normalizePaymentStatus = (value: unknown): PaymentStatus => {
  const allowed: PaymentStatus[] = [
    "unverified",
    "created",
    "authorized",
    "captured",
    "paid",
    "failed",
    "refunded",
    "partially_refunded",
  ];

  return allowed.includes(value as PaymentStatus)
    ? (value as PaymentStatus)
    : "unverified";
};

const normalizeFulfillmentStatus = (
  value: unknown
): FulfillmentStatus => {
  const allowed: FulfillmentStatus[] = [
    "pending",
    "packed",
    "backordered",
    "delivered",
    "unavailable",
  ];

  return allowed.includes(value as FulfillmentStatus)
    ? (value as FulfillmentStatus)
    : "pending";
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState("");
  const [expandedOrderMap, setExpandedOrderMap] = useState<
    Record<string, boolean>
  >({});

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  }, []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatPromisedDate = (date: string | null) => {
    if (!date) return null;

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError("");

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*, order_items(*), order_status_history(*)")
        .eq("user_id", user.id)
        .neq("status", "pending_payment")
        .order("created_at", { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      const mappedOrders: CustomerOrder[] = (ordersData || []).map((o: any) => {
        const createdAt = o.created_at
          ? new Date(o.created_at)
          : new Date();

        return {
          id: o.id,
          orderId: `RB-${
            o.order_number || o.id.slice(0, 6).toUpperCase()
          }`,
          status: normalizeOrderStatus(o.status),
          paymentStatus: normalizePaymentStatus(o.payment_status),
          createdAt,
          total: Number(o.total) || 0,
          subtotal: Number(o.subtotal) || 0,
          deliveryFee: Number(o.delivery_fee) || 0,
          discount: Number(o.discount) || 0,
          deliveryAddress: o.delivery_address,
          deliveryDate: o.delivery_date || null,
          history: o.order_status_history || [],
          items: (o.order_items || []).map((item: any) => ({
            id: item.variant_id || item.product_id || item.id,
            name: item.product_name || "Product",
            qty: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
            subtotal: Number(item.total_price) || 0,
            unit: item.variant_unit || "pack",
            img:
              item.product_image ||
              "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80",
            fulfillmentStatus: normalizeFulfillmentStatus(
              item.fulfillment_status
            ),
            promisedDate: item.promised_date || null,
            fulfillmentNote: item.fulfillment_note || null,
          })),
        };
      });

      setOrders(mappedOrders);

      const activeList = mappedOrders.filter((o) =>
        isActiveStatus(o.status)
      );

      if (activeList.length === 1) {
        setExpandedOrderMap((prev) => ({
          ...prev,
          [activeList[0].id]: true,
        }));
      }
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      setFetchError(
        "We couldn't load your orders right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }

    fetchOrders();
  }, [user, authLoading, fetchOrders]);

  const activeOrders = useMemo(
    () => orders.filter((order) => isActiveStatus(order.status)),
    [orders]
  );

  const pastOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === "delivered" ||
          order.status === "cancelled"
      ),
    [orders]
  );

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderMap((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleReorder = (items: OrderItem[]) => {
    items.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          img: item.img,
        },
        99
      );
    });

    setReorderSuccessMsg("All items added back to your cart!");

    window.setTimeout(() => {
      setReorderSuccessMsg("");
    }, 4000);
  };

  const renderEmptyState = () => (
    <div className="text-center py-16 sm:py-20 bg-white border border-gray-200 rounded-[32px] p-6 sm:p-10 shadow-xs space-y-4">
      <div className="w-20 h-20 bg-[#e5f5ef] border border-[#bce2d3] rounded-3xl flex items-center justify-center mx-auto shadow-xs">
        <Box className="text-[#004d3b]" size={38} />
      </div>

      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-gray-900 font-black text-xl uppercase tracking-tight">
          NO ROYAL ORDERS YET
        </h3>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest leading-relaxed">
          EXPLORE FRESH RIVER FISH, MUTTON & AUTHENTIC BENGAL GROCERIES.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block bg-[#004d3b] hover:bg-[#00382b] text-[#ffc400] font-black px-9 py-4 rounded-full text-xs uppercase tracking-[0.2em] shadow-md transition-all active:scale-95"
      >
        BROWSE MENU
      </Link>
    </div>
  );

  const getAddressText = (address: any) => {
    if (!address) return "Delivery address";

    const house =
      address.houseNumber || address.houseNo || address.flatNumber;

    const street =
      address.address || address.street || address.fullAddress;

    return [house, street].filter(Boolean).join(", ") || "Delivery address";
  };

  const getItemCounts = (items: OrderItem[]) => {
    return items.reduce(
      (counts, item) => {
        counts.total += item.qty;

        if (item.fulfillmentStatus === "delivered") {
          counts.delivered += item.qty;
        } else if (item.fulfillmentStatus === "unavailable") {
          counts.unavailable += item.qty;
        } else {
          counts.remaining += item.qty;
        }

        return counts;
      },
      { total: 0, delivered: 0, unavailable: 0, remaining: 0 }
    );
  };

  const renderItemFulfillment = (item: OrderItem) => (
    <div className="mt-2 space-y-1">
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${getFulfillmentStyle(
          item.fulfillmentStatus
        )}`}
      >
        {FULFILLMENT_LABELS[item.fulfillmentStatus]}
      </span>

      {item.promisedDate && (
        <p className="text-[10px] text-gray-500 font-medium">
          Expected: {formatPromisedDate(item.promisedDate)}
        </p>
      )}

      {item.fulfillmentNote && (
        <p className="text-[10px] text-gray-500 leading-relaxed">
          {item.fulfillmentNote}
        </p>
      )}
    </div>
  );

  const renderTimeline = (order: CustomerOrder) => {
    const status = order.status;

    if (status === "pending_payment") {
      return (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-black text-xs">
            <AlertCircle size={16} />
            Payment not confirmed
          </div>

          <p className="text-[11px] text-rose-700 leading-relaxed">
            Your order has not been confirmed yet and cannot be processed
            until your payment is verified.
          </p>

          <p className="text-[11px] text-rose-700 leading-relaxed">
            If an amount was debited from your account, please don't make
            another payment. If the transaction was unsuccessful, the amount
            will be reversed by your bank or payment provider. Reversal
            timelines depend on your bank or payment provider.
          </p>

          <p className="text-[11px] text-rose-700 leading-relaxed font-semibold">
            If the amount is not credited back within 5–7 business days,
            please contact our support team with your transaction details.
          </p>
        </div>
      );
    }

    if (status === "cancelled") {
      return (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-rose-800 font-black text-xs">
            <XCircle size={16} />
            Order cancelled
          </div>
          <p className="text-[11px] text-rose-700 mt-1">
            This order has been cancelled. Please contact support if you
            need assistance.
          </p>
        </div>
      );
    }

    const stages = [
      {
        title: "Order confirmed",
        description: "Your order has been confirmed.",
        icon: Check,
        completed: true,
      },
      {
        title: "Processing & preparation",
        description: "Your items are being checked and prepared.",
        icon: Box,
        completed: [
          "processing",
          "preparing",
          "ready_for_delivery",
          "out_for_delivery",
          "partially_fulfilled",
          "delivered",
        ].includes(status),
        current: ["processing", "preparing"].includes(status),
      },
      {
        title: "Ready for delivery",
        description: "Your order is ready for delivery.",
        icon: Truck,
        completed: [
          "ready_for_delivery",
          "out_for_delivery",
          "delivered",
        ].includes(status),
        current: status === "ready_for_delivery",
      },
      {
        title: "Out for delivery",
        description: "Your order is on its way.",
        icon: Bike,
        completed: ["out_for_delivery", "delivered"].includes(status),
        current: status === "out_for_delivery",
      },
      {
        title: "Delivered",
        description: "Your order has been delivered.",
        icon: CheckCircle2,
        completed: status === "delivered",
        current: status === "delivered",
      },
    ];

    return (
      <div className="space-y-4">
        {status === "partially_fulfilled" && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-orange-900 font-black text-xs">
              <Package size={16} />
              Your order is partially fulfilled
            </div>
            <p className="text-[11px] text-orange-800 mt-1 leading-relaxed">
              Some items have been delivered. The remaining items may be
              delivered separately according to their individual schedules.
            </p>
          </div>
        )}

        {stages.map((stage) => {
          const Icon = stage.icon;

          return (
            <div
              key={stage.title}
              className="flex items-start justify-between gap-3 relative"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    stage.completed
                      ? "bg-[#006b50] text-white"
                      : stage.current
                        ? "bg-[#ffc400] text-[#004d3b]"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {stage.completed && !stage.current ? (
                    <Check size={15} />
                  ) : (
                    <Icon size={15} />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-black text-gray-900">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {stage.description}
                  </p>
                </div>
              </div>

              {stage.current && (
                <span className="text-[10px] font-bold text-[#854d0e] bg-[#fef08a] px-2.5 py-1 rounded-full shrink-0">
                  In progress
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#ffc400] border-t-[#004d3b] rounded-full animate-spin" />
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
          Loading Your Orders...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#e5f5ef] rounded-3xl border border-[#bce2d3] flex items-center justify-center mb-6 shadow-md">
          <ShoppingBag className="text-[#004d3b]" size={36} />
        </div>

        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          Sign In to View Orders
        </h2>

        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-2 mb-8">
          Access live tracking and order receipts
        </p>

        <Link
          href="/login"
          className="bg-[#004d3b] text-[#ffc400] px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:bg-[#00382b] transition-all"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28 text-[#17211D]">
      {reorderSuccessMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#004d3b] text-[#ffc400] border border-amber-300 px-6 py-3 rounded-2xl shadow-2xl text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top duration-300 flex items-center gap-2">
          <Sparkles size={16} />
          {reorderSuccessMsg}
        </div>
      )}

      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 -ml-2 text-gray-700 hover:text-[#004d3b] hover:bg-[#e5f5ef] rounded-full transition-all"
            >
              <ArrowLeft size={22} />
            </Link>

            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-[#004d3b] font-serif">
              ROYAL BENGAL
            </h1>
          </div>

          <Link
            href="/"
            className="bg-[#e5f5ef] hover:bg-[#d5efe5] text-[#006b50] border border-[#bce2d3] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Leaf size={14} className="fill-[#006b50]" />
            SHOP FRESH
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {fetchError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="text-rose-600 shrink-0" size={18} />
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-800">{fetchError}</p>
              <button
                onClick={fetchOrders}
                className="mt-2 text-xs font-black uppercase text-rose-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="flex border-b border-gray-200 text-xs font-black tracking-wider uppercase">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 text-center pb-3 px-2 relative transition-colors ${
              activeTab === "active"
                ? "text-[#004d3b]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            ACTIVE ORDERS ({activeOrders.length})

            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#004d3b] rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 text-center pb-3 px-2 relative transition-colors ${
              activeTab === "past"
                ? "text-[#004d3b]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            PAST ORDERS ({pastOrders.length})

            {activeTab === "past" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#004d3b] rounded-t-full" />
            )}
          </button>
        </div>

        {activeTab === "active" && (
          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              renderEmptyState()
            ) : (
              activeOrders.map((order) => {
                const isExpanded = !!expandedOrderMap[order.id];
                const statusVal = order.status;
                const paymentPending = isPaymentPending(statusVal);
                const counts = getItemCounts(order.items);

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div
                      onClick={() => toggleOrderExpand(order.id)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          toggleOrderExpand(order.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      className="p-5 cursor-pointer flex items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl font-black text-[#004d3b] font-mono tracking-tight">
                            {order.orderId}
                          </span>

                          <span
                            className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase ${getOrderStatusStyle(
                              statusVal
                            )}`}
                          >
                            {paymentPending ? (
                              <AlertCircle size={12} />
                            ) : statusVal === "delivered" ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <Clock size={12} />
                            )}

                            {ORDER_STATUS_LABELS[statusVal]}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 font-medium">
                          Placed {formatDate(order.createdAt)} ·{" "}
                          {formatTime(order.createdAt)}
                        </p>

                        {!isExpanded && (
                          <p className="text-[11px] font-bold pt-0.5 text-[#006b50]">
                            {counts.total}{" "}
                            {counts.total === 1 ? "item" : "items"}
                            {statusVal === "partially_fulfilled"
                              ? ` · ${counts.delivered} delivered`
                              : ""}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-lg font-black text-[#004d3b] leading-none block">
                            {formatCurrency(order.total)}
                          </span>

                          <span className="text-[10px] font-black uppercase text-[#004d3b] tracking-wider mt-1 inline-flex items-center gap-0.5">
                            {isExpanded ? (
                              <>
                                Collapse <ChevronUp size={12} />
                              </>
                            ) : (
                              <>
                                Track order <ChevronDown size={12} />
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 pt-0 space-y-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="pt-4 flex justify-between items-start gap-3">
                          <div className="space-y-1">
                            <h2 className="text-base font-black text-[#004d3b] leading-snug">
                              {paymentPending
                                ? "Payment not confirmed"
                                : statusVal === "partially_fulfilled"
                                  ? "Your order is being delivered in parts"
                                  : statusVal === "out_for_delivery"
                                    ? "Your order is on the way!"
                                    : statusVal === "ready_for_delivery"
                                      ? "Your order is ready for delivery"
                                      : "We're preparing your order."}
                            </h2>

                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                              {paymentPending
                                ? "Your order is awaiting payment verification and cannot be processed yet."
                                : statusVal === "partially_fulfilled"
                                  ? "Some items have been delivered. Please check the individual item schedules below."
                                  : statusVal === "out_for_delivery"
                                    ? "Your order has been handed over for delivery."
                                    : statusVal === "ready_for_delivery"
                                      ? "Your order is ready for delivery."
                                      : "Your order is progressing through preparation."}
                            </p>

                            {!paymentPending && (
                              <p className="text-[10px] text-gray-500 font-medium">
                                Payment status:{" "}
                                <span className="font-bold capitalize">
                                  {isPaymentSuccessful(order.paymentStatus)
                                    ? "Paid"
                                    : order.paymentStatus.replace(/_/g, " ")}
                                </span>
                              </p>
                            )}
                          </div>

                          <a
                            href="tel:+916304076069"
                            onClick={(event) => event.stopPropagation()}
                            className="border-2 border-[#004d3b] text-[#004d3b] hover:bg-[#e5f5ef] px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
                          >
                            <PhoneCall size={13} />
                            Call Support
                          </a>
                        </div>

                        <div className="space-y-4 pt-1">
                          {renderTimeline(order)}
                        </div>

                        {statusVal === "partially_fulfilled" && (
                          <div className="bg-[#e5f5ef] border border-[#bce2d3] rounded-2xl p-3">
                            <p className="text-[11px] font-bold text-[#006b50]">
                              {counts.delivered} of {counts.total} units
                              delivered
                              {counts.remaining > 0
                                ? ` · ${counts.remaining} remaining`
                                : ""}
                              {counts.unavailable > 0
                                ? ` · ${counts.unavailable} unavailable`
                                : ""}
                            </p>
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-100 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">
                              Order items
                            </h3>
                            <span className="text-[10px] text-gray-400 font-bold">
                              {order.items.length} products
                            </span>
                          </div>

                          {order.items.map((item, idx) => (
                            <div
                              key={`${item.id}-${idx}`}
                              className="flex justify-between items-start gap-3 text-xs"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <img
                                  src={item.img}
                                  className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shrink-0"
                                  alt={item.name}
                                />

                                <div className="min-w-0">
                                  <p className="font-black text-gray-900 text-xs sm:text-sm">
                                    {item.name}
                                  </p>

                                  <p className="text-[11px] text-gray-500 font-bold">
                                    {item.qty} × {item.unit}
                                  </p>

                                  {renderItemFulfillment(item)}
                                </div>
                              </div>

                              <span className="font-black text-[#004d3b] text-base shrink-0">
                                {formatCurrency(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#e5f5ef] border border-[#bce2d3] rounded-2xl p-3.5 flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <MapPin
                              size={16}
                              className="text-[#006b50] shrink-0"
                            />

                            <p className="text-[11px] font-bold text-gray-700 truncate">
                              {getAddressText(order.deliveryAddress)}
                            </p>
                          </div>

                          <div className="h-8 w-px bg-[#bce2d3] shrink-0" />

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold text-gray-500 block uppercase">
                              Order total
                            </span>
                            <span className="text-base font-black text-[#004d3b]">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOrderExpand(order.id);
                          }}
                          className="w-full text-center py-2 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-[#004d3b] flex items-center justify-center gap-1 pt-3 border-t border-gray-100"
                        >
                          Tap to collapse <ChevronUp size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div className="space-y-4">
            {pastOrders.length === 0 ? (
              renderEmptyState()
            ) : (
              pastOrders.map((order) => {
                const isExpanded = !!expandedOrderMap[order.id];
                const isDelivered = order.status === "delivered";

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div
                      onClick={() => toggleOrderExpand(order.id)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          toggleOrderExpand(order.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      className="p-5 cursor-pointer flex justify-between items-center bg-gray-50/60 hover:bg-gray-100/60 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDelivered
                              ? "bg-[#e5f5ef] text-[#006b50]"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <XCircle size={18} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-gray-900 text-sm">
                              {order.orderId}
                            </span>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getOrderStatusStyle(
                                order.status
                              )}`}
                            >
                              {ORDER_STATUS_LABELS[order.status]}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleReorder(order.items);
                          }}
                          className="bg-[#004d3b] hover:bg-[#00382b] text-[#ffc400] px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                        >
                          <RefreshCw size={12} />
                          Reorder
                        </button>

                        {isExpanded ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <>
                        <div className="p-5 space-y-4">
                          {order.items.map((item, idx) => (
                            <div
                              key={`${item.id}-${idx}`}
                              className="flex justify-between items-start gap-3 text-xs"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <img
                                  src={item.img}
                                  className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0"
                                  alt={item.name}
                                />

                                <div className="min-w-0">
                                  <p className="font-bold text-gray-800">
                                    {item.name}
                                  </p>

                                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                                    {item.qty} × {item.unit}
                                  </p>

                                  {renderItemFulfillment(item)}
                                </div>
                              </div>

                              <span className="font-bold text-gray-900 shrink-0">
                                {formatCurrency(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-400 uppercase">
                            Order total
                          </span>

                          <span className="text-base font-black text-gray-900">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}
