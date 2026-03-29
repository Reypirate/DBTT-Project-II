"use client";

import { usePreorder } from "../context/PreorderContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { preorderItems, subtotal, updateQuantity, removeFromPreorder } = usePreorder();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-full w-full sm:max-w-md ml-auto flex flex-col bg-surface border-l border-neutral-main shadow-2xl">
        <DrawerHeader className="border-b border-neutral-main/20 pb-4 flex items-center justify-between">
          <div className="flex flex-col text-left">
            <DrawerTitle className="font-playfair text-2xl font-bold flex items-center gap-2 text-primary">
              <ShoppingCart className="size-5" />
              Your Selection
            </DrawerTitle>
            <DrawerDescription className="text-text-main/60">
              Review your ritual essentials before checkout
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 text-text-main/40">
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-grow overflow-y-auto px-6 py-4 custom-scrollbar">
          {preorderItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <div className="w-16 h-16 bg-neutral-main/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="size-8 text-text-main/30" />
              </div>
              <div>
                <p className="font-playfair text-xl font-bold text-text-main">Your cart is empty</p>
                <p className="text-sm text-text-main/60">
                  Start adding ritual items to see them here.
                </p>
              </div>
              <DrawerClose asChild>
                <Button variant="outline" className="mt-4">
                  Browse Bundles
                </Button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-6">
              {preorderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 group animate-in fade-in slide-in-from-right-4"
                >
                  <div className="relative size-20 rounded-xl overflow-hidden bg-muted border border-neutral-main/20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-text-main leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-text-main/50 uppercase tracking-widest mt-0.5">
                          {item.kind}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromPreorder(item.id)}
                        className="text-text-main/30 hover:text-red-500 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-background border border-neutral-main rounded-full px-2 py-0.5 shadow-sm scale-90 -ml-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="hover:text-primary transition-colors p-1"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="hover:text-primary transition-colors p-1"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <p className="font-bold text-primary font-mono text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {preorderItems.length > 0 && (
          <DrawerFooter className="border-t border-neutral-main/20 bg-surface/80 backdrop-blur-lg p-6 space-y-6 animate-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-main/60 uppercase tracking-widest font-medium">
                  Subtotal
                </span>
                <span className="font-bold text-lg font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <Separator className="bg-neutral-main/20" />
              <p className="text-[10px] text-text-main/40 text-center uppercase tracking-tighter">
                Delivery and taxes calculated at checkout
              </p>
            </div>

            <DrawerClose asChild>
              <Button
                onClick={handleCheckout}
                className="w-full h-14 text-lg font-bold gap-2 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight className="size-5" />
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
