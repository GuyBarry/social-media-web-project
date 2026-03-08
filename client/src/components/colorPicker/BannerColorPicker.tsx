import {
  BannerColorPickerCard,
  SwatchButton,
  SwatchGrid,
} from "./colorPicker.styled";
import { BannerColorSwitch } from "./BannerColorSwitch";
import { FieldLabel } from "../shared.styled";

const PRESET_SWATCHES: { hex: string; label: string }[] = [
  { hex: "#a8d1e7", label: "Light Blue" },
  { hex: "#6b8cba", label: "Muted Blue" },
  { hex: "#7a8b9a", label: "Slate Gray" },
  { hex: "#3d4f5c", label: "Dark Slate" },
  { hex: "#1a1a1a", label: "Black" },
  { hex: "#ffffff", label: "White" },
  { hex: "#8b3a3a", label: "Dark Red" },
  { hex: "#c8c8d0", label: "Light Silver" },
  { hex: "#6b8f71", label: "Muted Green" },
];

interface BannerColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const BannerColorPicker = ({ color, onChange }: BannerColorPickerProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <FieldLabel sx={{ mb: 1 }}>Banner Color</FieldLabel>
      <BannerColorPickerCard sx={{ flex: 1 }}>
        <BannerColorSwitch color={color} onChange={onChange} />

        <SwatchGrid>
          {PRESET_SWATCHES.map(({ hex, label }) => (
            <SwatchButton
              key={hex}
              swatchcolor={hex}
              selected={color.toLowerCase() === hex.toLowerCase()}
              onClick={() => onChange(hex)}
              title={label}
              type="button"
            />
          ))}
        </SwatchGrid>
      </BannerColorPickerCard>
    </div>
  );
};
