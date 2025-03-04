import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';

interface SoftwareCardProps {
    software: any;
}

const SoftwareCard = ({ software }: SoftwareCardProps) => {
    const { title, description, price, rating, image, badge } = software;

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full aspect-[4/3] object-cover"
                />
                {badge && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        {badge}
                    </Badge>
                )}
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
    );
};

export default SoftwareCard;
