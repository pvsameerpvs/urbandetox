import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui";
import { SEASONAL_TAGS } from "@urbandetox/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { PackageFormData } from "./use-package-form";

interface BasicInfoFieldsProps {
  control: Control<PackageFormData>;
  destinations: { slug: string; name: string }[];
}

export function BasicInfoFields({ control, destinations }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="e.g. Kashmir 3-Day Detox" className="h-11 rounded-xl" {...field} />
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          control={control}
          name="destinationSlug"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 rounded-xl w-full">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((d) => (
                    <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>
      <Controller
        control={control}
        name="subtitle"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Subtitle</label>
            <Input placeholder="Short description..." className="h-11 rounded-xl" {...field} />
            {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
          </div>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Controller
          control={control}
          name="duration"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (days)</label>
              <Input type="number" className="h-11 rounded-xl" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          control={control}
          name="startingPrice"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Starting Price (₹)</label>
              <Input type="number" className="h-11 rounded-xl" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          control={control}
          name="groupSize"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Size</label>
              <Input placeholder="6 to 12" className="h-11 rounded-xl" {...field} />
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Controller
          control={control}
          name="style"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Style</label>
              <Input placeholder="e.g. Lake-led + slow" className="h-11 rounded-xl" {...field} />
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          control={control}
          name="seasonalTag"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Seasonal Tag</label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 rounded-xl w-full">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {SEASONAL_TAGS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>
      <Controller
        control={control}
        name="coverImage"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image</label>
            <ImageUpload value={field.value} onChange={field.onChange} label="Cover Image" />
            {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
          </div>
        )}
      />
    </div>
  );
}
