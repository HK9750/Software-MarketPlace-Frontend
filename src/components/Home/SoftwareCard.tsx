"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface SoftwareCardProps {
    software: Product
    isInWishlist: boolean
    onAddToWishlist: (id: string) => void
    onRemoveFromWishlist: (id: string) => void
}

const SoftwareCard = ({ software, isInWishlist, onAddToWishlist, onRemoveFromWishlist }: SoftwareCardProps) => {
    const { id, title, description, price, rating, image, badge } = software

    const toggleWishlist = () => {
        if (isInWishlist) {
            onRemoveFromWishlist(id)
        } else {
            onAddToWishlist(id)
        }
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="relative">
                <img src={image || "/placeholder.svg"} alt={title} className="w-full aspect-[4/3] object-cover" />
                {badge && <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">{badge}</Badge>}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={toggleWishlist}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        className={cn(
                            "h-5 w-5 transition-colors",
                            isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground",
                        )}
                    />
                </Button>
            </div>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{rating}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold">{price}</span>
                    <Button size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default SoftwareCard

