import React, { useState } from "react";

export default function Input({ placeholder }) {
   const [form, setForm] = useState("");
   return (
      <input
         type="text"
         placeholder={placeholder}
         value={form}
         onChange={(e) => setForm(e.target.value)}
      />
   );
}
