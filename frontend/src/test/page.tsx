"use client";

import { useEffect } from "react";
import api from "../../services/api";
export default function TestPage() {
  useEffect(() => {
    api
      .get("/")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-10">
      Backend Connection Test
    </div>
  );
}