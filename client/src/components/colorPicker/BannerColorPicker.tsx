import { theme } from "../../themes";
import { FieldLabel } from "../fieldLabel/FieldLabel.styled";
import { BannerColorSwitch } from "./BannerColorSwitch";
import {
  BannerColorPickerCard,
  SwatchButton,
  SwatchGrid,
} from "./colorPicker.styled";

const PRESET_SWATCHES: { hex: string; label: string }[] = [
  { hex: theme.banner[1], label: "Banner 1" },
  { hex: theme.banner[2], label: "Banner 2" },
  { hex: theme.banner[3], label: "Banner 3" },
  { hex: theme.banner[4], label: "Banner 4" },
  { hex: theme.banner[5], label: "Banner 5" },
  { hex: theme.banner[6], label: "Banner 6" },
  { hex: theme.banner[7], label: "Banner 7" },
  { hex: theme.banner[8], label: "Banner 8" },
  { hex: theme.banner[9], label: "Banner 9" },
];

interface BannerColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const BannerColorPicker = ({
  color,
  onChange,
}: BannerColorPickerProps) => {
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
