import React from "react";
import Dashboard from "../Components/Dashboard/Dashboard";
import Add_Admin from "../Components/Admin/Add_Admin";
import View_Admin from "../Components/Admin/View_Admin";
import Add_Cleint from "../Components/Cleint/Add_Cleint";
import CleintDT from "../Components/Cleint/CleintDT";
import View_Cleint from "../Components/Cleint/View_Cleint";
import View_CleintDT from "../Components/Cleint/View_CleintDT";
import Log from "../Components/Log/Log";
import Add_Slab from "../Components/Slab/Add_Slab";
import SlabDT from "../Components/Slab/SlabDT";
import View_Slab from "../Components/Slab/View_Slab";
import View_SlabDT from "../Components/Slab/View_SlabDT";
import Add_Template from "../Components/template/Add_Template";
import View_Template from "../Components/template/View_Template";
import View_WpSetup_Main from "../Components/WpApiSetup/View_WpSetup_Main";
import View_WpSetupDT from "../Components/WpApiSetup/View_WpSetupDT";
import WpSetup_Main from "../Components/WpApiSetup/WpSetup_Main";
import WpSetupDT from "../Components/WpApiSetup/WpSetupDT";
import DocumentLink_main from "../Components/WpDocumentLinkSetup/DocumentLink_main";
import DocumentLinkDT from "../Components/WpDocumentLinkSetup/DocumentLinkDT";
import View_DocumentLink_main from "../Components/WpDocumentLinkSetup/View_DocumentLink_main";
import View_DocumentLinkDT from "../Components/WpDocumentLinkSetup/View_DocumentLinkDT";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Login_Page from "../Components/Login_Page.jsx/Login_Page";
import Main_layout from "../Components/Main_layout";
import DataTransfer from "../Components/Data Transfer/DataTransfer";

const Routing = () => {
  return (
    <>
      <Routes>
        <Route path="/Login_Page" element={<Login_Page />} />

        <Route path="/Dashboard" element={<Dashboard />} />

        <Route path="/Add_Admin" element={<Add_Admin />} />
        <Route path="/View_Admin" element={<View_Admin />} />

        <Route path="/Add_Cleint" element={<Add_Cleint />} />
        <Route path="/CleintDT" element={<CleintDT />} />
        <Route path="/View_Cleint" element={<View_Cleint />} />
        <Route path="/View_CleintDT" element={<View_CleintDT />} />

        <Route path="/Log" element={<Log />} />

        <Route path="/Add_Slab" element={<Add_Slab />} />
        <Route path="/SlabDT" element={<SlabDT />} />
        <Route path="/View_Slab" element={<View_Slab />} />
        <Route path="/View_SlabDT" element={<View_SlabDT />} />

        <Route path="/Add_Template" element={<Add_Template />} />
        <Route path="/View_Template" element={<View_Template />} />

        <Route path="/WpSetup_Main" element={<WpSetup_Main />} />
        <Route path="/WpSetupDT" element={<WpSetupDT />} />
        <Route path="/View_WpSetup_Main" element={<View_WpSetup_Main />} />
        <Route path="/View_WpSetupDT" element={<View_WpSetupDT />} />

        <Route path="/DocumentLink_main" element={<DocumentLink_main />} />
        <Route path="/DocumentLinkDT" element={<DocumentLinkDT />} />
        <Route
          path="/View_DocumentLink_main"
          element={<View_DocumentLink_main />}
        />
        <Route path="/View_DocumentLinkDT" element={<View_DocumentLinkDT />} />

        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/Main_layout" element={<Main_layout />} />

        <Route path="/DataTransfer" element={<DataTransfer />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/" element={<Navigate to="/Dashboard" replace />} />
      </Routes>
    </>
  );
};

export default Routing;
