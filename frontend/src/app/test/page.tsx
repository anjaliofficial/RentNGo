"use client";

import { useEffect } from "react";
import api from "@/services/api";

export default function TestPage() {
  useEffect(() => {
    api
      .get("/equipment")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.response?.data));
  }, []);

  return (
    <div className="p-10">
      Backend Connection Test
    </div>
  );
}