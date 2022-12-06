import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "../lib/authenticate";
import { favouritesAtom, searchHistoryAtom } from "../store";
import { useAtom } from "jotai";
import { getFavourites, getHistory } from "../lib/userData";

const PUBLIC_PATHS = ["/login", "/", "/_error", "/register"];

export default function RouteGuard({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [favourites, setFavourites] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      await updateAtoms();
    };

    fetchUserData();
    authCheck(router.pathname);

    router.events.on("routeChangeComplete", authCheck);
    return () => {
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  const updateAtoms = async () => {
    setFavourites(await getFavourites());
    setSearchHistory(await getHistory());
  };

  const authCheck = (url) => {
    const path = url.split("?")[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  };

  return <>{authorized && children}</>;
}
