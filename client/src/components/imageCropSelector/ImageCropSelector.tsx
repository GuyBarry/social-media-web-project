import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useCallback, useEffect, useRef, useState } from "react";
import { CostumButton } from "../button/CostumButton.styled";
import {
  CropActionsRow,
  CropHandle,
  CropImage,
  CropSelection,
  CropWrapper,
} from "./ImageCropSelector.styled";

interface Rect {
  x: number;
  y: number;
  size: number;
}

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

interface Props {
  previewUrl: string;
  originalFile: File;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

const MIN_SIZE = 40;

export const ImageCropSelector = ({
  previewUrl,
  originalFile,
  onConfirm,
  onCancel,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const dragRef = useRef<DragMode>({ type: "idle" });

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

  const onWrapperPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-crop-selection]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toImgCoords(e.clientX, e.clientY);
    dragRef.current = { type: "drawing", startX: x, startY: y };
    setRect({ x, y, size: 0 });
  };

  const onWrapperPointerMove = (e: React.PointerEvent) => {
    const mode = dragRef.current;
    if (mode.type !== "drawing") return;
    const { x, y } = toImgCoords(e.clientX, e.clientY);
    const { w, h } = imgSize();
    const rawSize = Math.max(
      Math.abs(x - mode.startX),
      Math.abs(y - mode.startY),
    );
    const size = clamp(rawSize, 0, Math.min(w, h));
    const rx = x < mode.startX ? mode.startX - size : mode.startX;
    const ry = y < mode.startY ? mode.startY - size : mode.startY;
    setRect({
      x: clamp(rx, 0, w - size),
      y: clamp(ry, 0, h - size),
      size,
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
      x: clamp(mode.origX + dx, 0, w - rect.size),
      y: clamp(mode.origY + dy, 0, h - rect.size),
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
    const delta = Math.max(e.clientX - mode.startX, e.clientY - mode.startY);
    const newSize = clamp(
      mode.origRect.size + delta,
      MIN_SIZE,
      Math.min(w - mode.origRect.x, h - mode.origRect.y),
    );
    setRect({ ...rect, size: newSize });
  };

  const onHandlePointerUp = () => {
    if (dragRef.current.type === "resizing") {
      dragRef.current = { type: "idle" };
    }
  };

  const handleConfirm = useCallback(async () => {
    if (!rect || rect.size < MIN_SIZE) return;
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
    const size = Math.round(rect.size * Math.min(scaleX, scaleY));
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      img,
      Math.round(rect.x * scaleX),
      Math.round(rect.y * scaleY),
      size,
      size,
      0,
      0,
      size,
      size,
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

  useEffect(() => {
    const el = imgRef.current;
    if (!el || !previewUrl) return;
    const init = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const size = Math.min(width, height) * 0.7;
      setRect({
        x: (width - size) / 2,
        y: (height - size) / 2,
        size,
      });
    };
    if (el.complete) init();
    else el.onload = init;
  }, [previewUrl]);

  return (
    <div>
      <CropWrapper
        ref={wrapperRef}
        onPointerDown={onWrapperPointerDown}
        onPointerMove={onWrapperPointerMove}
        onPointerUp={onWrapperPointerUp}
      >
        <CropImage ref={imgRef} src={previewUrl} alt="Crop preview" />

        {rect && rect.size >= MIN_SIZE && (
          <CropSelection
            data-crop-selection
            style={{
              left: rect.x,
              top: rect.y,
              width: rect.size,
              height: rect.size,
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
          disabled={!rect || rect.size < MIN_SIZE}
          onClick={handleConfirm}
        >
          Apply crop
        </CostumButton>
      </CropActionsRow>
    </div>
  );
};
