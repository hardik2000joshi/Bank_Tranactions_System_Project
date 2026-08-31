import {BrowserRouter, Routes, Route} from "react-router-dom";
import { RegisterPage } from "../../components/registerPage";
import { LoginPage } from "../../components/loginPage";
import { LogoutPage } from "../../components/logoutPage";
import { AccountPage } from "../../components/AccountPage";
import { SystemUserDashboard } from "../../components/systemUserDashboard";
import { TransactionPage } from "../../components/TransactionPage";
import { SystemUserLogin } from "../../components/systemUserLogin";


export function AppRoutes(){
    return (
       <BrowserRouter>
       <Routes>
        <Route 
        path="/"
        element={<RegisterPage />}
        />
        <Route
        path="/login"
        element={<LoginPage/>}
         />
         <Route
         path="/logout"
         element={<LogoutPage />}
          />
          <Route
          path="/accounts"
          element={<AccountPage />}
          />
          <Route
          path="/system-dashboard"
          element={<SystemUserDashboard />}
          />
          <Route
          path="/transactions"
          element={<TransactionPage />}
           />
           <Route
           path="/system-login"
           element={<SystemUserLogin />}
            />
       </Routes>
       </BrowserRouter>
    )
}