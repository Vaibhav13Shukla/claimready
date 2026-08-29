import { AppProvider, useApp } from "./lib/store";
import { Shell } from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Balance, Dashboard, Passbook } from "./pages/Account";
import Withdraw from "./pages/Withdraw";
import { TrackDetail, TrackList } from "./pages/Track";
import { Calculators, Pension } from "./pages/Tools";
import { GrievancePage, Kyc, Nominee, Transfer, UanHelp } from "./pages/Forms";
import Help from "./pages/Help";
import { About, Accessibility, DeathClaim, Employers, NotFound, Offices, Services } from "./pages/Info";
import AskWidget from "./components/AskWidget";

function Router() {
  const { path } = useApp();
  const clean = path.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

  if (clean.startsWith("/track/")) return <TrackDetail id={clean.replace("/track/", "")} />;

  switch (clean) {
    case "/":
      return <Home />;
    case "/login":
      return <Login />;
    case "/dashboard":
      return <Dashboard />;
    case "/balance":
      return <Balance />;
    case "/passbook":
      return <Passbook />;
    case "/withdraw":
      return <Withdraw />;
    case "/track":
      return <TrackList />;
    case "/pension":
      return <Pension />;
    case "/calculators":
      return <Calculators />;
    case "/transfer":
      return <Transfer />;
    case "/kyc":
      return <Kyc />;
    case "/nominee":
      return <Nominee />;
    case "/grievance":
      return <GrievancePage />;
    case "/uan-help":
      return <UanHelp />;
    case "/help":
      return <Help />;
    case "/services":
      return <Services />;
    case "/about":
      return <About />;
    case "/offices":
      return <Offices />;
    case "/death-claim":
      return <DeathClaim />;
    case "/employers":
      return <Employers />;
    case "/accessibility":
      return <Accessibility />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Shell>
        <Router />
      </Shell>
      <AskWidget />
    </AppProvider>
  );
}
