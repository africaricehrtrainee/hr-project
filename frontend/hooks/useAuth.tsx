import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import axios from "axios";

interface AuthContextType {
    user: Employee | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode; // Use ReactNode to include children prop
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Employee | null>(null);

    useEffect(() => {
        // Check session on initial load
        axios
            .get("http://localhost:4000/api/session")
            .then((response) => setUser(response.data.user))
            .catch(() => setUser(null));
    }, []);

    const login = async (username: string, password: string) => {
        // Implement login logic
        const response = await axios.post("http://localhost:4000/api/login", {
            username,
            password,
        });
        setUser(response.data.user);
    };

    const logout = async () => {
        // Implement logout logic
        await axios.post("/api/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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
