
'use client';
import { Button } from "@/components/ui/button";
import { Home, Wallet, User, Menu } from "lucide-react";

type BottomNavBarProps = {
    onMenuClick: () => void;
}

export default function BottomNavBar({ onMenuClick }: BottomNavBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-t border-border flex md:hidden items-center justify-around z-30">
            <Button variant="ghost" className="flex flex-col items-center h-full text-muted-foreground">
                <Home className="h-6 w-6" />
                <span className="text-xs">Home</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center h-full text-muted-foreground">
                <Wallet className="h-6 w-6" />
                <span className="text-xs">Wallet</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center h-full text-muted-foreground">
                <User className="h-6 w-6" />
                <span className="text-xs">Profile</span>
            </Button>
            <Button variant="ghost" onClick={onMenuClick} className="flex flex-col items-center h-full text-muted-foreground">
                <Menu className="h-6 w-6" />
                <span className="text-xs">Menu</span>
            </Button>
        </div>
    )
}
