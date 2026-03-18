import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CropLandscapeIcon from "@mui/icons-material/CropLandscape";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { CostumButton } from "../button/CostumButton.styled";
import {
  CropActionsRow,
  CropHandle,
  CropImage,
  CropSelection,
  CropWrapper,
  RatioToggleRow,
} from "./ImageCropSelector.styled";

export type AspectRatio = "1:1" | "4:3";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Returns { w, h } multipliers for a given ratio label. */
const ratioMultipliers = (ratio: AspectRatio) =>
  ratio === "4:3" ? { rw: 4, rh: 3 } : { rw: 1, rh: 1 };

type DragMode =
  | { type: "idle" }
  | { type: "drawing"; startX: number; startY: number }
  | {
      type: "moving";
      startX: number;
      startY: number;
      origX: number;
      origY: number;
    }
  | { type: "resizing"; startX: number; startY: number; origRect: Rect };

interface ImageCropSelectorProps {
  previewUrl: string;
  originalFile: File;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: AspectRatio;
  onAspectRatioChange?: (ratio: AspectRatio) => void;
}

const MIN_SIZE = 40;

export const ImageCropSelector: FC<ImageCropSelectorProps> = ({
  previewUrl,
  originalFile,
  onConfirm,
  onCancel,
  aspectRatio = "1:1",
  onAspectRatioChange,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const dragRef = useRef<DragMode>({ type: "idle" });

  const { rw, rh } = ratioMultipliers(aspectRatio);

  const toImgCoords = useCallback((clientX: number, clientY: number) => {
    const el = imgRef.current;
    if (!el) return { x: 0, y: 0 };
    const bounds = el.getBoundingClientRect();
    return {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    };
  }, []);

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const imgSize = useCallback(() => {
    const el = imgRef.current;
    if (!el) return { w: 0, h: 0 };
    const bounds = el.getBoundingClientRect();
    return { w: bounds.width, h: bounds.height };
  }, []);

  /** Given a "base width", returns the corresponding { width, height } for the current ratio. */
  const sizeFromWidth = useCallback(
    (w: number) => ({ width: w, height: (w * rh) / rw }),
    [rw, rh],
  );

  /** Max base-width that fits the image at the current ratio. */
  const maxBaseWidth = useCallback(() => {
    const { w, h } = imgSize();
    return Math.min(w, (h * rw) / rh);
  }, [imgSize, rw, rh]);

  const onWrapperPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-crop-selection]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toImgCoords(e.clientX, e.clientY);
    dragRef.current = { type: "drawing", startX: x, startY: y };
    setRect({ x, y, width: 0, height: 0 });
  };

  const onWrapperPointerMove = (e: React.PointerEvent) => {
    const mode = dragRef.current;
    if (mode.type !== "drawing") return;
    const { x, y } = toImgCoords(e.clientX, e.clientY);
    const { w, h } = imgSize();
    const rawW = Math.abs(x - mode.startX);
    const baseWidth = clamp(rawW, 0, maxBaseWidth());
    const { width, height } = sizeFromWidth(baseWidth);
    const rx = x < mode.startX ? mode.startX - width : mode.startX;
    const ry = y < mode.startY ? mode.startY - height : mode.startY;
    setRect({
      x: clamp(rx, 0, w - width),
      y: clamp(ry, 0, h - height),
      width,
      height,
    });
  };

  const onWrapperPointerUp = () => {
    if (dragRef.current.type === "drawing") {
      dragRef.current = { type: "idle" };
    }
  };

  const onSelectionPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!rect) return;
    dragRef.current = {
      type: "moving",
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.x,
      origY: rect.y,
    };
  };

  const onSelectionPointerMove = (e: React.PointerEvent) => {
    const mode = dragRef.current;
    if (mode.type !== "moving" || !rect) return;
    const { w, h } = imgSize();
    const dx = e.clientX - mode.startX;
    const dy = e.clientY - mode.startY;
    setRect({
      ...rect,
      x: clamp(mode.origX + dx, 0, w - rect.width),
      y: clamp(mode.origY + dy, 0, h - rect.height),
    });
  };

  const onSelectionPointerUp = () => {
    if (dragRef.current.type === "moving") {
      dragRef.current = { type: "idle" };
    }
  };

  const onHandlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!rect) return;
    dragRef.current = {
      type: "resizing",
      startX: e.clientX,
      startY: e.clientY,
      origRect: { ...rect },
    };
  };

  const onHandlePointerMove = (e: React.PointerEvent) => {
    const mode = dragRef.current;
    if (mode.type !== "resizing" || !rect) return;
    const { w, h } = imgSize();
    const delta = e.clientX - mode.startX;
    const newBaseWidth = clamp(
      mode.origRect.width + delta,
      MIN_SIZE,
      Math.min(w - mode.origRect.x, ((h - mode.origRect.y) * rw) / rh),
    );
    const { width, height } = sizeFromWidth(newBaseWidth);
    setRect({ ...rect, width, height });
  };

  const onHandlePointerUp = () => {
    if (dragRef.current.type === "resizing") {
      dragRef.current = { type: "idle" };
    }
  };

  const handleConfirm = useCallback(async () => {
    if (!rect || rect.width < MIN_SIZE) return;
    const el = imgRef.current;
    if (!el) return;

    const img = new Image();
    img.src = previewUrl;
    await new Promise<void>((res) => {
      if (img.complete) {
        res();
        return;
      }
      img.onload = () => res();
    });

    const scaleX = img.naturalWidth / el.getBoundingClientRect().width;
    const scaleY = img.naturalHeight / el.getBoundingClientRect().height;

    const canvas = document.createElement("canvas");
    const cropW = Math.round(rect.width * scaleX);
    const cropH = Math.round(rect.height * scaleY);
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      img,
      Math.round(rect.x * scaleX),
      Math.round(rect.y * scaleY),
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const ext = originalFile.name.split(".").pop() ?? "jpg";
        const croppedFile = new File(
          [blob],
          `${originalFile.name.replace(/\.[^.]+$/, "")}_cropped.${ext}`,
          { type: blob.type },
        );
        onConfirm(croppedFile);
      },
      "image/jpeg",
      0.92,
    );
  }, [rect, previewUrl, originalFile, onConfirm]);

  /** Re-center the crop selection whenever the aspect ratio changes. */
  const initRect = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    const { width: iw, height: ih } = el.getBoundingClientRect();
    if (!iw || !ih) return;
    const baseWidth = Math.min(iw, (ih * rw) / rh) * 0.7;
    const { width, height } = sizeFromWidth(baseWidth);
    setRect({
      x: (iw - width) / 2,
      y: (ih - height) / 2,
      width,
      height,
    });
  }, [rw, rh, sizeFromWidth]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el || !previewUrl) return;
    if (el.complete) initRect();
    else el.onload = initRect;
  }, [previewUrl, initRect]);

  return (
    <div>
      <RatioToggleRow>
        <CostumButton
          size="small"
          variant={aspectRatio === "1:1" ? "contained" : "outlined"}
          startIcon={<CropSquareIcon fontSize="small" />}
          onClick={() => onAspectRatioChange?.("1:1")}
        >
          Square
        </CostumButton>
        <CostumButton
          size="small"
          variant={aspectRatio === "4:3" ? "contained" : "outlined"}
          startIcon={<CropLandscapeIcon fontSize="small" />}
          onClick={() => onAspectRatioChange?.("4:3")}
        >
          Wide
        </CostumButton>
      </RatioToggleRow>

      <CropWrapper
        ref={wrapperRef}
        onPointerDown={onWrapperPointerDown}
        onPointerMove={onWrapperPointerMove}
        onPointerUp={onWrapperPointerUp}
      >
        <CropImage ref={imgRef} src={previewUrl} alt="Crop preview" />

        {rect && rect.width >= MIN_SIZE && (
          <CropSelection
            data-crop-selection
            style={{
              left: rect.x,
              top: rect.y,
              width: rect.width,
              height: rect.height,
            }}
            onPointerDown={onSelectionPointerDown}
            onPointerMove={onSelectionPointerMove}
            onPointerUp={onSelectionPointerUp}
          >
            <CropHandle
              style={{ bottom: -6, right: -6, cursor: "se-resize" }}
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
            />
          </CropSelection>
        )}
      </CropWrapper>

      <CropActionsRow>
        <CostumButton
          variant="outlined"
          color="error"
          startIcon={<CloseIcon fontSize="small" />}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            onCancel();
          }}
        >
          Cancel
        </CostumButton>
        <CostumButton
          variant="contained"
          color="success"
          startIcon={<CheckIcon fontSize="small" />}
          disabled={!rect || rect.width < MIN_SIZE}
          onClick={handleConfirm}
        >
          Apply crop
        </CostumButton>
      </CropActionsRow>
    </div>
  );
};
