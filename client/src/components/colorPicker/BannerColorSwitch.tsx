import { useRef } from "react";
import PaletteIcon from "@mui/icons-material/Palette";
import { BannerColorHexInput, BannerColorPreview, BannerColorSwitchBox } from "./colorPicker.styled";

interface BannerColorSwitchProps {
  color: string;
  onChange: (color: string) => void;
}

export const BannerColorSwitch = ({ color, onChange }: BannerColorSwitchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleHexChange = (raw: string) => {
    const value = raw.startsWith("#") ? raw : `#${raw}`;
    onChange(value);
  };

  const handleHexBlur = (raw: string) => {
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
      onChange(color);
    } else {
      onChange(hex);
    }
  };

  return (
    <BannerColorSwitchBox>
      <BannerColorPreview
        color={color}
        title="Click to open colour picker"
        onClick={() => inputRef.current?.click()}
      >
        <div className="color-preview-overlay">
          <PaletteIcon />
        </div>
        <input
          ref={inputRef}
          type="color"
          value={color.length === 7 && color.startsWith("#") ? color : "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
      </BannerColorPreview>

      <BannerColorHexInput
        value={color}
        onChange={(e) => handleHexChange(e.target.value)}
        onBlur={(e) => handleHexBlur(e.target.value)}
        maxLength={7}
        spellCheck={false}
      />
    </BannerColorSwitchBox>
  );
};
