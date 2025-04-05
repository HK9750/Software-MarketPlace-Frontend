import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AnalyticsPageSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <div className="h-8 w-64 bg-muted rounded-md mb-2"></div>
                <div className="h-4 w-96 bg-muted rounded-md"></div>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="h-8 w-8 rounded-full bg-muted mb-2"></div>
                            <div className="h-4 w-20 bg-muted rounded-md mb-2"></div>
                            <div className="h-6 w-16 bg-muted rounded-md mb-2"></div>
                            <div className="h-4 w-24 bg-muted rounded-md mt-2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <div className="h-6 w-48 bg-muted rounded-md mb-2"></div>
                        <div className="h-4 w-64 bg-muted rounded-md"></div>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <div className="h-full w-full bg-muted/50 rounded-md"></div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="h-6 w-36 bg-muted rounded-md mb-2"></div>
                        <div className="h-4 w-48 bg-muted rounded-md"></div>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <div className="h-full w-full bg-muted/50 rounded-md"></div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-6 w-36 bg-muted rounded-md mb-2"></div>
                            <div className="h-4 w-48 bg-muted rounded-md"></div>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center">
                            <div className="h-full w-full bg-muted/50 rounded-md"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
