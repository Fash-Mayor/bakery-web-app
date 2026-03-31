import React, { useEffect, useMemo, useRef, useState } from "react";
import * as fabric from "fabric";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAllBakers, uploadImage } from "../utils/dataService";
import { sendWhatsAppMessage } from "../utils/whatsappService";

const SHAPES = [
  { id: "round", label: "Round" },
  { id: "square", label: "Square" },
  { id: "heart", label: "Heart" },
  { id: "star", label: "Star" },
  { id: "hex", label: "Hexagon" },
];

const TEXT_FONTS = [
  "Georgia",
  "Times New Roman",
  "serif",
  "cursive",
  "Trebuchet MS",
  "Impact",
];

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function lightenHex(hex, amount01) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c) => Math.round(c + (255 - c) * amount01);
  const rr = mix(r);
  const gg = mix(g);
  const bb = mix(b);
  return `#${((1 << 24) + (rr << 16) + (gg << 8) + bb).toString(16).slice(1)}`;
}

function createPatternFromFabricImage(textureFabricImage, patternScale = 1) {
  return new fabric.Pattern({
    source: textureFabricImage.getElement(),
    repeat: "repeat",
    patternTransform: new fabric.iMatrix().scale({
      x: patternScale,
      y: patternScale,
    }),
  });
}

function createStarPoints(cx, cy, outerR, innerR, pointsCount) {
  const points = [];
  for (let i = 0; i < pointsCount * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / pointsCount) * i - Math.PI / 2;
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }
  return points;
}

function createCakeShape(shapeId, w, h, fill, extra = {}) {
  const common = {
    fill,
    selectable: true,
    hasControls: true,
    hasBorders: false,
    lockUniScaling: false,
    originX: "center",
    originY: "center",
    stroke: extra.stroke || "rgba(255,255,255,0.18)",
    strokeWidth: extra.strokeWidth || 1,
  };

  if (shapeId === "round") {
    return new fabric.Ellipse({
      rx: w / 2,
      ry: h / 2,
      ...common,
    });
  }

  if (shapeId === "square") {
    return new fabric.Rect({
      width: w,
      height: h,
      rx: Math.max(18, w * 0.12),
      ...common,
    });
  }

  if (shapeId === "hex") {
    const r = Math.min(w, h) / 2;
    const cx = 0;
    const cy = 0;
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      points.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
    return new fabric.Polygon(points, {
      ...common,
      // polygon points are around (0,0) already; keep it centered.
      left: 0,
      top: 0,
    });
  }

  if (shapeId === "star") {
    const outerR = Math.min(w, h) / 2;
    const innerR = outerR * 0.45;
    const points = createStarPoints(0, 0, outerR, innerR, 5);
    return new fabric.Polygon(points, {
      ...common,
      left: 0,
      top: 0,
    });
  }

  // Heart: simple multi-object group approximation.
  if (shapeId === "heart") {
    const r = Math.min(w, h) * 0.22;
    const leftCircle = new fabric.Circle({
      radius: r,
      left: -r * 0.95,
      top: -r * 0.2,
      originX: "center",
      originY: "center",
      ...common,
    });
    const rightCircle = new fabric.Circle({
      radius: r,
      left: r * 0.95,
      top: -r * 0.2,
      originX: "center",
      originY: "center",
      ...common,
    });
    const bottom = new fabric.Polygon(
      [
        { x: -r * 1.45, y: 0 },
        { x: r * 1.45, y: 0 },
        { x: 0, y: r * 2.0 },
      ],
      {
        ...common,
        left: 0,
        top: 0,
      },
    );

    return new fabric.Group([bottom, leftCircle, rightCircle], {
      originX: "center",
      originY: "center",
      left: 0,
      top: 0,
    });
  }

  // Fallback: round
  return new fabric.Ellipse({
    rx: w / 2,
    ry: h / 2,
    ...common,
  });
}

function createDrips(
  shapeId,
  w,
  h,
  dripCount,
  dripColor = "rgba(255,255,255,0.45)",
) {
  const drips = [];
  const count = Math.max(2, Math.min(18, dripCount));
  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 0.92 - 0.46) * w;
    const dripH = (Math.random() * 0.22 + 0.08) * h;
    const dripW = (Math.random() * 0.12 + 0.06) * w;
    const yTop = -h / 2 + 10;
    const scaleX = Math.random() * 0.25 + 0.85;

    // Slightly vary drip shapes for a more "handmade" look.
    const drip =
      i % 3 === 0
        ? new fabric.Ellipse({
            rx: dripW / 2,
            ry: dripH / 2,
            left: x,
            top: yTop + dripH / 2,
            originX: "center",
            originY: "center",
            fill: dripColor,
            selectable: false,
            evented: false,
          })
        : new fabric.Rect({
            width: dripW,
            height: dripH,
            left: x,
            top: yTop + dripH / 2,
            originX: "center",
            originY: "center",
            rx: Math.max(4, dripW * 0.25),
            fill: dripColor,
            selectable: false,
            evented: false,
            angle: (Math.random() * 16 - 8) * (shapeId === "round" ? 1 : 0.8),
            scaleX,
          });

    drips.push(drip);
  }
  return drips;
}

const BuildCake = () => {
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  const [bakers, setBakers] = useState([]);
  const [selectedBakerId, setSelectedBakerId] = useState("");

  const [isLoadingBakers, setIsLoadingBakers] = useState(false);

  const [shapeId, setShapeId] = useState("round");
  const [tierSize, setTierSize] = useState(260);
  const [tierColor, setTierColor] = useState("#f59e0b");
  const [useTexture, setUseTexture] = useState(false);
  const [texturePattern, setTexturePattern] = useState(null);
  const [texturePatternScale, setTexturePatternScale] = useState(1);
  const [dripIntensity, setDripIntensity] = useState(7); // approx dripCount
  const [glossIntensity, setGlossIntensity] = useState(0.55);

  const [textValue, setTextValue] = useState("Happy Birthday");
  const [textFont, setTextFont] = useState("cursive");
  const [textColor, setTextColor] = useState("#111827");
  const [textSize, setTextSize] = useState(46);
  const [textAlign, setTextAlign] = useState("center");
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);

  const [activeObjectType, setActiveObjectType] = useState("");

  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    deliveryDate: "",
    specialInstructions: "",
    bakerMessage: "",
    estimatedPrice: "",
  });

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const selectedBaker = useMemo(
    () => bakers.find((b) => b.id === selectedBakerId),
    [bakers, selectedBakerId],
  );

  const setOrderField = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let cancelled = false;

    const loadBakers = async () => {
      setIsLoadingBakers(true);
      try {
        const data = await fetchAllBakers();
        if (cancelled) return;
        setBakers(data);
        if (!selectedBakerId && data.length) setSelectedBakerId(data[0].id);
      } catch (err) {
        console.error(err);
        if (!cancelled)
          toast.error("Failed to load bakers. You can still build your cake.");
      } finally {
        if (!cancelled) setIsLoadingBakers(false);
      }
    };

    loadBakers();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!canvasElRef.current) return;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      preserveObjectStacking: true,
      selection: true,
    });
    fabricCanvasRef.current = canvas;

    // A "plate" background to make the preview feel like a real cake render.
    const plate = new fabric.Ellipse({
      left: 360,
      top: 460,
      rx: 260,
      ry: 80,
      fill: "rgba(255, 255, 255, 0.9)",
      stroke: "rgba(249, 115, 22, 0.25)",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.10)",
        blur: 20,
        offsetX: 0,
        offsetY: 12,
      }),
    });

    canvas.setDimensions({ width: 720, height: 520 }, { backstoreOnly: true });
    // canvas.setBackgroundColor("rgba(255, 255, 255, 1)", canvas.renderAll.bind(canvas));
    canvas.backgroundColor = "rgba(255, 255, 255, 1)";
    canvas.requestRenderAll();
    canvas.add(plate);
    // canvas.sendToBack(plate);
    canvas.sendObjectToBack(plate);

    const updateActive = () => {
      const active = canvas.getActiveObject();
      if (!active) {
        setActiveObjectType("");
        return;
      }
      // We mark tiers/text with custom flags below.
      if (active.isCakeTier) setActiveObjectType("tier");
      else if (active.isCakeText) setActiveObjectType("text");
      else setActiveObjectType(active.type || "");
    };

    canvas.on("selection:created", updateActive);
    canvas.on("selection:updated", updateActive);
    canvas.on("selection:cleared", updateActive);

    // Keyboard delete support.
    const onKeyDown = (e) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const tag = document.activeElement?.tagName?.toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const current = fabricCanvasRef.current;
      if (!current) return;
      const active = current.getActiveObject();
      if (!active) return;

      current.remove(active);
      current.discardActiveObject();
      current.requestRenderAll();
      setActiveObjectType("");
    };
    window.addEventListener("keydown", onKeyDown);

    // return () => {
    //   window.removeEventListener("keydown", onKeyDown);
    //   canvas.dispose();
    //   fabricCanvasRef.current = null;
    // };
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (fabricCanvasRef.current) {
        // Since dispose is async in v6, we catch any cleanup errors
        fabricCanvasRef.current.dispose().catch(console.error);
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  const addTier = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const existingTiers = canvas.getObjects().filter((o) => o.isCakeTier);

    const tiersCount = existingTiers.length;
    const centerX = canvas.getWidth() / 2;
    const centerY = canvas.getHeight() / 2 - tiersCount * 74;

    const w = tierSize;
    const h = tierSize * 0.72;

    const fill = useTexture && texturePattern ? texturePattern : tierColor;

    // Build a depth-like tier: top + slightly bigger darker base + frosting drips + gloss.
    const topShape = createCakeShape(shapeId, w, h, fill, {
      stroke: "rgba(255,255,255,0.22)",
      strokeWidth: 1.2,
    });

    const baseFill =
      useTexture && texturePattern
        ? texturePattern
        : lightenHex(tierColor, 0.05);
    const baseShape = createCakeShape(shapeId, w * 1.035, h * 1.02, baseFill, {
      stroke: "rgba(0,0,0,0.05)",
      strokeWidth: 0.8,
    });

    // With groups (heart), we only set scale/opacity on the group wrapper.
    if (topShape.type === "group") {
      topShape.set({ scaleX: 1, scaleY: 1 });
    }
    if (baseShape.type === "group") {
      baseShape.set({ scaleX: 1, scaleY: 1, opacity: 0.85 });
    }

    const top = topShape;
    const base = baseShape;
    const dripColor = rgba("#ffffff", 0.45);
    const drips = createDrips(shapeId, w, h, dripIntensity, dripColor);

    // Gloss layer (subtle highlight) to sell the "wow" look.
    const gloss = new fabric.Ellipse({
      rx: w * 0.34,
      ry: h * 0.22,
      left: -w * 0.18,
      top: -h * 0.16,
      fill: `rgba(255, 255, 255, ${glossIntensity * 0.35})`,
      selectable: false,
      evented: false,
      angle: -12,
    });

    // Depth shadow for the tier group.
    const tierShadow = new fabric.Shadow({
      color: "rgba(0,0,0,0.12)",
      blur: 22,
      offsetX: 0,
      offsetY: 16,
    });

    const tierGroup = new fabric.Group([base, top, ...drips, gloss], {
      left: centerX,
      top: centerY,
      originX: "center",
      originY: "center",
      angle: 0,
      hasControls: true,
      hasBorders: false,
      selectable: true,
      shadow: tierShadow,
    });
    tierGroup.isCakeTier = true;

    // Slightly move the base down for a faux 3D feel.
    // (Children are positioned around (0,0), so adjusting their top works.)
    tierGroup._objects.forEach((obj) => {
      if (obj === base) obj.set({ top: 10, opacity: 0.82 });
      if (obj === top) obj.set({ top: -2 });
    });

    // Nice default transform controls.
    tierGroup.setControlsVisibility({
      mt: true,
      mb: true,
      ml: true,
      mr: true,
      mtr: true,
      bl: false,
      br: false,
      tl: false,
      tr: false,
    });

    canvas.add(tierGroup);
    canvas.setActiveObject(tierGroup);
    canvas.requestRenderAll();
  };

  const handleTextureUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);

    fabric.Image.fromURL(
      url,
      (img) => {
        const pattern = createPatternFromFabricImage(img, texturePatternScale);
        setTexturePattern(pattern);
        setUseTexture(true);
        toast.success("Texture ready. Add a new layer to apply it.");
        URL.revokeObjectURL(url);
      },
      { crossOrigin: "anonymous" },
    );
  };

  const applyTextureToActive = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    if (!texturePattern) {
      toast.error("Upload a texture first.");
      return;
    }
    const active = canvas.getActiveObject();
    if (!active) {
      toast.error("Select a cake tier first.");
      return;
    }

    const applyFill = (obj) => {
      if (!obj || typeof obj.set !== "function") return;
      if (obj.type === "group" && Array.isArray(obj._objects)) {
        obj._objects.forEach((child) => applyFill(child));
        return;
      }
      if (obj.fill !== undefined) {
        obj.set("fill", texturePattern);
      }
    };

    applyFill(active);
    canvas.requestRenderAll();
    toast.success("Texture applied to selected item.");
  };

  const addText = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = (textValue || "").trim();
    if (!text) {
      toast.error("Type something first.");
      return;
    }

    const shadow = new fabric.Shadow({
      color: "rgba(0,0,0,0.25)",
      blur: 10,
      offsetX: 0,
      offsetY: 4,
    });

    const textObj = new fabric.Textbox(text, {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2 - 120,
      width: 420,
      textAlign,
      fontSize: textSize,
      fontFamily: textFont,
      fontWeight: textBold ? 700 : 400,
      fontStyle: textItalic ? "italic" : "normal",
      fill: textColor,
      shadow,
      editable: true,
      hasControls: true,
      hasBorders: false,
      selectable: true,
      originX: "center",
      originY: "center",
    });

    textObj.isCakeText = true;

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.requestRenderAll();
  };

  const bringForward = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    // canvas.bringForward(active);
    canvas.bringObjectForward(active);
    canvas.requestRenderAll();
  };

  const sendBackward = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    // canvas.sendBackwards(active);
    canvas.sendObjectBackwards(active);
    canvas.requestRenderAll();
  };

  const duplicateActive = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone((cloned) => {
      cloned.set({
        left: active.left + 12,
        top: active.top + 12,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  };

  const clearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const plate = canvas
      .getObjects()
      .find((o) => !o.isCakeTier && !o.isCakeText);
    canvas.getObjects().forEach((obj) => {
      if (obj !== plate) canvas.remove(obj);
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const exportCanvasAsPngFile = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) throw new Error("Canvas not ready");

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    // multiplier to improve exported resolution.
    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fileName = `custom-cake-${Date.now()}.png`;
    return new File([blob], fileName, { type: "image/png" });
  };

  const handleDownload = async () => {
    try {
      const file = await exportCanvasAsPngFile();
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded your cake preview.");
    } catch (err) {
      console.error(err);
      toast.error("Could not download the image.");
    }
  };

  const handlePlaceOrder = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (!selectedBakerId) {
      toast.error("Select a baker.");
      return;
    }

    if (
      !orderForm.customerName.trim() ||
      !orderForm.customerPhone.trim() ||
      !orderForm.deliveryAddress.trim() ||
      !orderForm.deliveryDate
    ) {
      toast.error("Please fill name, phone, address, and delivery date.");
      return;
    }

    try {
      toast.info("Exporting your cake...");
      const exportedFile = await exportCanvasAsPngFile();

      toast.info("Uploading image to WhatsApp...");
      const imageUrl = await uploadImage(
        exportedFile,
        "product-images",
        `cake-builder/${selectedBakerId}`,
      );

      const orderData = {
        customerName: orderForm.customerName,
        customerEmail: "",
        customerPhone: orderForm.customerPhone,
        deliveryAddress: orderForm.deliveryAddress,
        deliveryDate: orderForm.deliveryDate,
        specialInstructions: orderForm.specialInstructions,
        items: [],
        totalAmount: orderForm.estimatedPrice
          ? Number(orderForm.estimatedPrice)
          : 0,
        bakerName: selectedBaker?.shop_name || "",
        bakerId: selectedBaker?.id || selectedBakerId,
        cakeImageUrl: imageUrl,
        customerMessage: orderForm.bakerMessage,
      };

      sendWhatsAppMessage(orderData, {
        customMessage: `
Custom Cake Order 🍰
Baker: ${selectedBaker?.shop_name || "Not specified"}
Customer: ${orderForm.customerName} (${orderForm.customerPhone})
Delivery: ${orderForm.deliveryAddress}
Delivery Date: ${orderForm.deliveryDate}
Order Note: ${orderForm.bakerMessage || "None"}
Special Instructions: ${orderForm.specialInstructions || "None"}

Cake image: ${imageUrl}
        `,
      });

      toast.success("WhatsApp opened with your cake image.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 md:p-8 pb-28">
      <ToastContainer />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">
            🍰 Build Your Cake
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Drag, resize, rotate layers. Add textures and cake-style text. Then
            order via WhatsApp to your chosen baker.
          </p>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-orange-50 to-white rounded-2xl border border-orange-100 p-3">
                <div className="rounded-xl overflow-hidden">
                  <canvas
                    ref={canvasElRef}
                    className="w-full"
                    aria-label="Cake canvas"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={addTier}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-5 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
                  >
                    + Add Layer
                  </button>

                  <button
                    type="button"
                    onClick={addText}
                    className="bg-gray-900 text-white font-semibold px-5 py-3 rounded-xl hover:bg-gray-800 transition shadow"
                  >
                    + Add Text
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition font-semibold"
                  >
                    Download PNG
                  </button>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-4 mt-4">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Selected:{" "}
                    <span className="font-semibold text-orange-700">
                      {activeObjectType || "None"}
                    </span>
                    <span className="ml-2 text-gray-400">
                      (Tip: press Delete to remove)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={bringForward}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-semibold"
                    >
                      Bring Forward
                    </button>
                    <button
                      type="button"
                      onClick={sendBackward}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-semibold"
                    >
                      Send Backward
                    </button>
                    <button
                      type="button"
                      onClick={duplicateActive}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-semibold"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={applyTextureToActive}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition font-semibold"
                    >
                      Apply Texture
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-5">
              <div className="space-y-6">
                {/* Layer controls */}
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    1) Cake Layer
                  </h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Shape
                      <select
                        value={shapeId}
                        onChange={(e) => setShapeId(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        {SHAPES.map((s) => (
                          <option value={s.id} key={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Size
                      <input
                        type="range"
                        min={140}
                        max={360}
                        value={tierSize}
                        onChange={(e) => setTierSize(Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {tierSize}px
                      </div>
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Color (for base + fallback)
                      <input
                        type="color"
                        value={tierColor}
                        onChange={(e) => setTierColor(e.target.value)}
                        className="mt-2 w-full h-11"
                      />
                    </label>

                    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={useTexture}
                        onChange={(e) => setUseTexture(e.target.checked)}
                        className="accent-orange-600"
                      />
                      Use texture fill
                    </label>

                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                      <div className="text-sm font-semibold text-orange-900 mb-2">
                        Texture Upload
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleTextureUpload(e.target.files?.[0])
                        }
                        className="w-full text-sm"
                      />
                      <label className="block text-xs font-semibold text-gray-700 mt-3">
                        Texture scale
                        <input
                          type="range"
                          min={0.3}
                          max={2.2}
                          step={0.1}
                          value={texturePatternScale}
                          onChange={(e) =>
                            setTexturePatternScale(Number(e.target.value))
                          }
                          className="mt-2 w-full"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {texturePatternScale.toFixed(1)}x
                        </div>
                      </label>
                      <div className="text-xs text-gray-600 mt-2">
                        Upload a texture, then add a new layer (or select one
                        and tap “Apply Texture”).
                      </div>
                    </div>

                    <label className="block text-sm font-semibold text-gray-700">
                      Frosting Drips
                      <input
                        type="range"
                        min={2}
                        max={14}
                        value={dripIntensity}
                        onChange={(e) =>
                          setDripIntensity(Number(e.target.value))
                        }
                        className="mt-2 w-full"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {dripIntensity} drips
                      </div>
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Gloss
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={glossIntensity}
                        onChange={(e) =>
                          setGlossIntensity(Number(e.target.value))
                        }
                        className="mt-2 w-full"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(glossIntensity * 100)}%
                      </div>
                    </label>
                  </div>
                </section>

                {/* Text controls */}
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    2) Cake Text
                  </h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Text
                      <input
                        type="text"
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Font
                      <select
                        value={textFont}
                        onChange={(e) => setTextFont(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        {TEXT_FONTS.map((f) => (
                          <option value={f} key={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Color
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="mt-2 w-full h-11"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Size
                      <input
                        type="range"
                        min={22}
                        max={80}
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {textSize}px
                      </div>
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Alignment
                      <select
                        value={textAlign}
                        onChange={(e) => setTextAlign(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </label>

                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={textBold}
                          onChange={(e) => setTextBold(e.target.checked)}
                          className="accent-orange-600"
                        />
                        Bold
                      </label>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={textItalic}
                          onChange={(e) => setTextItalic(e.target.checked)}
                          className="accent-orange-600"
                        />
                        Italic
                      </label>
                    </div>

                    <div className="text-xs text-gray-600">
                      After adding text, double-click the text on the canvas to
                      edit it (like real cake inscriptions).
                    </div>
                  </div>
                </section>

                {/* Order controls */}
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    3) Order
                  </h3>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Choose Baker
                      <select
                        value={selectedBakerId}
                        onChange={(e) => setSelectedBakerId(e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        disabled={isLoadingBakers || bakers.length === 0}
                      >
                        {bakers.length === 0 && (
                          <option value="" key="empty">
                            {isLoadingBakers ? "Loading..." : "No bakers found"}
                          </option>
                        )}
                        {bakers.map((b) => (
                          <option value={b.id} key={b.id}>
                            {b.shop_name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Full Name *
                      <input
                        name="customerName"
                        type="text"
                        value={orderForm.customerName}
                        onChange={setOrderField}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        placeholder="e.g. Fash Mayor"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Phone (WhatsApp) *
                      <input
                        name="customerPhone"
                        type="tel"
                        value={orderForm.customerPhone}
                        onChange={setOrderField}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        placeholder="e.g. 0801 234 5678"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Delivery Address *
                      <textarea
                        name="deliveryAddress"
                        rows="3"
                        value={orderForm.deliveryAddress}
                        onChange={setOrderField}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none bg-white"
                        placeholder="Within Lagos and Ogun"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Delivery Date *
                      <input
                        name="deliveryDate"
                        type="date"
                        min={today}
                        value={orderForm.deliveryDate}
                        onChange={setOrderField}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Special Instructions
                      <textarea
                        name="specialInstructions"
                        rows="2"
                        value={orderForm.specialInstructions}
                        onChange={setOrderField}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none bg-white"
                        placeholder="Allergens, delivery notes, etc."
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Message for the Baker
                      <textarea
                        name="bakerMessage"
                        rows="2"
                        value={orderForm.bakerMessage}
                        onChange={setOrderField}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none bg-white"
                        placeholder="What should the baker know?"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-gray-700">
                      Estimated Price (optional)
                      <input
                        name="estimatedPrice"
                        type="number"
                        value={orderForm.estimatedPrice}
                        onChange={setOrderField}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        placeholder="e.g. 25000"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
                    >
                      ✅ Send Order on WhatsApp (with image)
                    </button>

                    <div className="text-xs text-gray-600">
                      WhatsApp will open with your cake image preview link and
                      your message to the selected baker.
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildCake;
