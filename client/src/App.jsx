import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HomeAdmin from "./pages/admin/HomeAdmin";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import { AdminPrivateRoute, PrivateRoute } from "./components/PrivateRoute";
import UserDetailView from "./pages/admin/UserDetailView";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin" element={<HomeAdmin />}></Route>
          <Route path="/admin/users/:id" element={<UserDetailView />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
