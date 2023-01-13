import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "../components/MyDocument";
import dynamic from "next/dynamic";

function testPdf() {
  return (
    <div>
      <PDFViewer>
        <MyDocument />
      </PDFViewer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(testPdf), {
  ssr: false,
});
