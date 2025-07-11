
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import CreateGame from "./pages/CreateGame";
import FindCourse from "./pages/FindCourse";
import GameWorkspace from "./pages/GameWorkspace";
import Recommendations from "./pages/Recommendations";
import Consultation from "./pages/Consultation";
import MeetingRoom from "./pages/MeetingRoom";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/find-course" element={
              <ProtectedRoute>
                <FindCourse />
              </ProtectedRoute>
            } />
            <Route path="/assessment" element={
              <ProtectedRoute>
                <CreateGame />
              </ProtectedRoute>
            } />
            <Route path="/recommendations" element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            } />
            <Route path="/consultation" element={
              <ProtectedRoute>
                <Consultation />
              </ProtectedRoute>
            } />
            <Route path="/meeting-room" element={
              <ProtectedRoute>
                <MeetingRoom />
              </ProtectedRoute>
            } />
            <Route path="/game-workspace" element={
              <ProtectedRoute>
                <GameWorkspace />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
