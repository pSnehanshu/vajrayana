import { Button, buttonVariants } from "@/components/ui/button";
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
  useMapEvents,
} from "react-leaflet";
import { type LatLngLiteral } from "leaflet";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { type RouterOutputs, trpcRQ } from "@/lib/trpc";
import { Separator } from "@/components/ui/separator";
import L from "leaflet";
import { MdGpsFixed } from "react-icons/md";
import { renderToStaticMarkup } from "react-dom/server";

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

      <DialogContent className="overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Create new Charging Station</DialogTitle>
          <DialogDescription>
            Once a charging station is created, you can configure your real
            charger to connect to this platform.
          </DialogDescription>
        </DialogHeader>

        <Separator />

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
                    Your charging station is supposed to append this to the OCPP
                    URL when connecting the platform. We use this (alongwith
                    other parameters) to identify the station.
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
                    This name will be used to refer to the station within the
                    platform
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
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

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

const GPSBtnControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },

  onAdd: function (map: L.Map) {
    // Create a container for your button
    const container = L.DomUtil.create("div", "leaflet-control");

    // Create the button element
    const button = L.DomUtil.create(
      "button",
      buttonVariants({ variant: "outline", size: "sm" }),
      container,
    );
    button.type = "button"; // Otherwise it tries to submit the form
    button.innerHTML = renderToStaticMarkup(<MdGpsFixed className="size-4" />);

    // Add click event listener to your button
    L.DomEvent.on(button, "click", (e) => {
      e.stopPropagation();
      map.locate({ setView: true, maxZoom: 16 });
    });

    return container;
  },
});

interface CoordsPickerProps {
  point: LatLngLiteral;
  onChange?: (point: LatLngLiteral) => void;
}
function CoordsPicker({ point, onChange }: CoordsPickerProps) {
  const map = useMapEvents({
    click: (e) => onChange?.(e.latlng),
    locationfound: (e) => onChange?.(e.latlng),
    locationerror: (err) =>
      toast(<span className="text-destructive">{err.message}</span>),
  });

  // Mount GPS button
  useEffect(() => {
    const gpsBtn = new GPSBtnControl();
    gpsBtn.addTo(map);

    return () => {
      map.removeControl(gpsBtn);
    };
  }, [map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
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
