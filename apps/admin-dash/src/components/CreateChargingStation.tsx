import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
} from "react-leaflet";
import { type LatLngLiteral } from "leaflet";
import { toast } from "sonner";
import { useState } from "react";
import { RouterOutputs, trpcRQ } from "@/lib/trpc";

const formSchema = z.object({
  friendlyName: z.string().trim().optional(),
  urlName: z
    .string()
    .regex(
      /^[a-zA-Z0-9*\-_=|@.+]+$/,
      `This is case-insensitive dataType and can only contain characters from the following character set: a-z, A-Z, 0-9, '*', '-', '_', '=', '+', '|', '@', '.'`,
    )
    .max(48),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

interface CreateChargingStationProps {
  onCreate?: (cs: RouterOutputs["stations"]["create"]) => void;
}
export function CreateChargingStation({
  onCreate,
}: CreateChargingStationProps) {
  const [open, setOpen] = useState(false);

  const createMutation = trpcRQ.stations.create.useMutation({
    onSuccess(data) {
      setOpen(false);
      setTimeout(() => onCreate?.(data), 500);
    },
    onError(error) {
      toast(
        <span className="text-destructive">
          Failed to create, something went wrong!
        </span>,
      );
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friendlyName: "",
      urlName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate(values);
  }

  const { latitude = 26.1500833, longitude = 91.7850556 } = form.getValues();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaPlus className="mr-1 translate-y-[1px]" />
          <span>Create new Charging Station</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Charging Station</DialogTitle>
          <DialogDescription>
            Once a charging station is created, you can configure your real
            charger to connect to this platform.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="urlName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Your station is supposed to append this at the end of the
                    OCPP URL when connecting, to help the platform identify it.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="friendlyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Friendly Name (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This name will be used to refer to the chargepoint within
                    the platform
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={11}
                  scrollWheelZoom={true}
                  className="h-52"
                >
                  <CoordsPicker
                    point={{ lat: latitude, lng: longitude }}
                    onChange={(point) => {
                      form.setValue("latitude", point.lat, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("longitude", point.lng, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                </MapContainer>
              </FormControl>

              <FormDescription>
                Plot the location of the charging station on the map, or enter
                the coordinates below
              </FormDescription>
            </FormItem>

            <div className="flex space-x-2">
              <div>
                <FormLabel>Latitude</FormLabel>
                <Input {...form.register("latitude")} />
              </div>

              <div>
                <FormLabel>Longitude</FormLabel>
                <Input {...form.register("longitude")} />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="reset" variant="secondary">
                Reset
              </Button>

              <Button type="submit" isLoading={createMutation.isLoading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface CoordsPickerProps {
  point: LatLngLiteral;
  onChange?: (point: LatLngLiteral) => void;
}
function CoordsPicker({ point, onChange }: CoordsPickerProps) {
  useMapEvent("click", (e) => {
    onChange?.(e.latlng);
  });

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={point}>
        <Popup>
          {point.lat}, {point.lng}
        </Popup>
      </Marker>
    </>
  );
}
