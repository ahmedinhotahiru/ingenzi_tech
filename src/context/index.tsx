import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
interface DataContextProps {
  siteSettings: any | null;
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
  const [siteSettings, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  let route = window.location.href;

  let id: string | number | null;
  if (route.includes("test")) {
    id = route.split("/")[4];
  } else {
    id = null;
  }

  const siteId = id || 300;

  const getRandomType = () => Math.floor(Math.random() * 4) + 1;
  const getRandomType2 = () => Math.floor(Math.random() * 3) + 1;

  // Fetch user settings data from an API
  useEffect(() => {
    const newProperties = {
      background_color: "white",
      navLinks: [
        "Home",
        "About",
        "Features",
        "Testimonials",
        "FAQS",
        "Contacts",
      ],
    };
    const fetchData = async () => {
      setInitialLoading(false);
      try {
        const response = await axios.get(
          `https://sitescribe.vercel.app/api/v1/backend/fetch-site?id=300`,
        );
        console.log("result: ", response.data);
        response.data.properties = {
          ...response.data.properties,
          ...newProperties,
        };
        // response.data.contact = {
        //   ...response.data.contact,
        //   ...{ location: "Douala - Cameroon", twitter: "twitter.com" },
        // };

        setUserData(response.data);
      } catch (error: any) {
        console.log("result: ", error);
        setError(error.message || "Error fetching data");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [siteId]);

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
