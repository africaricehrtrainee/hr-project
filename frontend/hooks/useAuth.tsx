import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: Employee | null;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<Employee | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode; // Use ReactNode to include children prop
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Employee | null>(null);
    const router = useRouter();
    useEffect(() => {
        // Check session on initial load
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`)
            .then((response) => {
                setUser(response.data.user);
            })
            .catch(() => setUser(null));
    }, []);

    const logout = async () => {
        // Implement logout logic
        setUser(null);
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`);
    };

    return (
        <AuthContext.Provider value={{ user, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useAuth();
    const router = useRouter();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user.user) {
            router.push("/auth"); // Redirect to your login page
        }
    }, [user, router]);

    if (!user) {
        return null; // You can also display an access denied message here
    }

    return <>{children}</>;
};
