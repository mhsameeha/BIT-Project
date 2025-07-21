'use client';
import Button from "@mui/material/Button";
import React, { useEffect, useRef } from "react";

export interface JitsiMeetProps  {
  roomName: string;
  userName: string;
  width?: string | number;
  height?: string | number;
};


export const joinRoom = async (container: HTMLDivElement, roomName: string, userName: string) => {
  if (!container) return;

  // Load Jitsi script dynamically
  if (!document.getElementById("jitsi-script")) {
    const script = document.createElement("script");
    script.id = "jitsi-script";
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => console.log("Jitsi script loaded");
    document.body.appendChild(script);
    await new Promise(resolve => script.onload = resolve);
  }

  container.style.display = "block";
  container.requestFullscreen?.();

  const domain = "meet.jit.si";
  const options = {
    roomName,
    width: "100%",
    height: "100%",
    parentNode: container,
    userInfo: { displayName: userName },
  };

  // @ts-ignore
  const api = new window.JitsiMeetExternalAPI(domain, options);
  
};

