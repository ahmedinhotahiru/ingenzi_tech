import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of user settings (customize based on your actual data structure)
interface UserSettings {
  themeColor: string;
  fontSize: string;
  language: string;
}

interface DataContextProps {
  siteSettings: UserSettings | null;
  loading: boolean;
  error: string | null;
  initialLoading: boolean; // Track if initial loading is still in progress
}

// Create the context
const DataContext = createContext<DataContextProps | undefined>(undefined);

// Context provider component
export const ContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [siteSettings, setUserData] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Fetch user settings data from an API
  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(false);
      try {
        const response = await fetch(
          "https://your-api-endpoint.com/user-settings",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user settings");
        }
        const result = await response.json();
        setUserData(result);
      } catch (error: any) {
        // setError(error.message || "Error fetching data");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{ siteSettings, loading, error, initialLoading }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use user settings data
export const useSiteSettings = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a ContextProvider");
  }
  return context;
};
