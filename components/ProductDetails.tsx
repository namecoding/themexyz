"use client"

import React, { useState } from "react"
import PreviewModal from "@/components/preview-modal"
import {useRouter} from "next/navigation";

interface ProductDetailsProps {
  item: any
  addToCart: (item: any) => void
  isInCart: boolean
  cartCount: number
  onClose?: () => void // optional, used when rendered in modal
}

export default function ProductDetails({
  item,
  addToCart = () => {},
  isInCart = false,
  cartCount = 0,
  onClose,
}: ProductDetailsProps) {


  const router = useRouter();

  return (
    <PreviewModal
      item={item}
      addToCart={addToCart}
      isInCart={isInCart}
      cartCount={cartCount}
      onClose={onClose || (() => router.back())}
    />
  )
}

