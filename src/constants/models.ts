import type { ModelItem } from "../types/models";

export const benchyParts = [
  {
    name: "Bridge roof",
    url: "/stl/benchy-multi-part/Multi-part - Single - Bridge roof.stl",
  },
  {
    name: "Bridge walls",
    url: "/stl/benchy-multi-part/Multi-part - Single - Bridge walls.stl",
  },
  {
    name: "Cargo box",
    url: "/stl/benchy-multi-part/Multi-part - Single - Cargo box.stl",
  },
  {
    name: "Chimney body",
    url: "/stl/benchy-multi-part/Multi-part - Single - Chimney body.stl",
  },
  {
    name: "Chimney top",
    url: "/stl/benchy-multi-part/Multi-part - Single - Chimney top.stl",
  },
  {
    name: "Deck surface",
    url: "/stl/benchy-multi-part/Multi-part - Single - Deck surface.stl",
  },
  {
    name: "Doorframe port",
    url: "/stl/benchy-multi-part/Multi-part - Single - Doorframe port.stl",
  },
  {
    name: "Doorframe starboard",
    url: "/stl/benchy-multi-part/Multi-part - Single - Doorframe starboard.stl",
  },
  {
    name: "Fishing-rod-holder",
    url: "/stl/benchy-multi-part/Multi-part - Single - Fishing-rod-holder.stl",
  },
  {
    name: "Gunwale",
    url: "/stl/benchy-multi-part/Multi-part - Single - Gunwale.stl",
  },
  {
    name: "Hawsepipe port",
    url: "/stl/benchy-multi-part/Multi-part - Single - Hawsepipe port.stl",
  },
  {
    name: "Hawsepipe starboard",
    url: "/stl/benchy-multi-part/Multi-part - Single - Hawsepipe starboard.stl",
  },
  {
    name: "Hull",
    url: "/stl/benchy-multi-part/Multi-part - Single - Hull.stl",
  },
  {
    name: "Stern name plate",
    url: "/stl/benchy-multi-part/Multi-part - Single - Stern name plate.stl",
  },
  {
    name: "Stern window",
    url: "/stl/benchy-multi-part/Multi-part - Single - Stern window.stl",
  },
  {
    name: "Wheel",
    url: "/stl/benchy-multi-part/Multi-part - Single - Wheel.stl",
  },
  {
    name: "Window",
    url: "/stl/benchy-multi-part/Multi-part - Single - Window.stl",
  },
];

export const sampleData: ModelItem[] = [
  {
    id: 1,
    name: "3DBenchy - Multi-Part (17 parts)",
    type: "Multi-Part STL",
    size: "15.4 MB",
    dateAdded: "2025-12-07",
    isMultiPart: true,
    parts: benchyParts,
    fileExtension: ".stl",
  },
  {
    id: 2,
    name: "3DBenchy - Complete",
    type: "STL Model",
    size: "11.0 MB",
    dateAdded: "2025-12-07",
    modelUrl: "/stl/benchy-multi-part/Multi-part - Complete (17 shells).stl",
    fileExtension: ".stl",
  },
  {
    id: 3,
    name: "Rubber Ducky",
    type: "STL Model",
    size: "14.1 MB",
    dateAdded: "2025-12-11",
    modelUrl: "/stl/Duck.stl",
    fileExtension: ".stl",
    defaultRotation: { x: 0, y: 0, z: 90 },
  },
  {
    id: 4,
    name: "Cow",
    type: "OBJ Model",
    size: "0.17 MB",
    dateAdded: "2025-12-07",
    modelUrl: "/obj/cow.obj",
    fileExtension: ".obj",
  },
  {
    id: 5,
    name: "Teapot",
    type: "OBJ Model",
    size: "0.20 MB",
    dateAdded: "2025-12-07",
    modelUrl: "/obj/teapot.obj",
    fileExtension: ".obj",
  },
  {
    id: 6,
    name: "Emu",
    type: "OBJ Model",
    size: "2.70 MB",
    dateAdded: "2025-12-11",
    modelUrl: "/obj/emu.obj",
    fileExtension: ".obj",
    defaultRotation: { x: -90, y: 0, z: 180 },
  },
];
