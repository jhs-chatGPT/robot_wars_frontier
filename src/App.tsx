import { GameLayout } from './components/layout/GameLayout';
import { AdminPage } from './pages/AdminPage';
import { BattlePage } from './pages/BattlePage';
import { HangarPage } from './pages/HangarPage';
import { EncyclopediaPage } from './pages/EncyclopediaPage';
import { OptionPage } from './pages/OptionPage';
import { RecruitPage } from './pages/RecruitPage';
import { ShopPage } from './pages/ShopPage';
import { TitlePage } from './pages/TitlePage';
import { UnitListPage } from './pages/UnitListPage';
import { HomePage } from './pages/HomePage';
import { PartsPage } from './pages/PartsPage';
import { PilotPage } from './pages/PilotPage';
import { PvpPage } from './pages/PvpPage';
import { ScenarioPage } from './pages/ScenarioPage';
import { StartPage } from './pages/StartPage';
import { TournamentPage } from './pages/TournamentPage';
import { useGameStore } from './store/gameStore';

export default function App() {
  const pilot = useGameStore((s) => s.pilot);
  const page = useGameStore((s) => s.page);
  const hasEnteredGame = useGameStore((s) => s.hasEnteredGame);

  if (!pilot || !hasEnteredGame) return <StartPage />;

  const pages = {
    home: <HomePage />,
    pilot: <PilotPage />,
    hangar: <HangarPage />,
    unitlist: <UnitListPage />,
    parts: <PartsPage />,
    recruit: <RecruitPage />,
    shop: <ShopPage />,
    encyclopedia: <EncyclopediaPage />,
    scenario: <ScenarioPage />,
    battle: <BattlePage />,
    pvp: <PvpPage />,
    tourney: <TournamentPage />,
    admin: <AdminPage />,
    option: <OptionPage />,
    titlepage: <TitlePage />,
  } as const;

  return <GameLayout>{pages[page as keyof typeof pages] ?? <HomePage />}</GameLayout>;
}
