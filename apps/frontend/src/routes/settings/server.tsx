import { trpcRQ } from "@/lib/trpc";
import { createFileRoute } from "@tanstack/react-router";
import { KeyDescription, SettingsKeyDetails } from "@zigbolt/shared";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CiEdit } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/server")({
  component: OrgSettings,
});

function OrgSettings() {
  const [{ settings }, settingsQuery] = trpcRQ.settings.get.useSuspenseQuery({
    keys: "all",
  });

  return (
    <Table>
      <TableCaption>
        This is a list of all the settings for your server
      </TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>Setting</TableHead>
          <TableHead className="text-center">Value</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Object.entries(SettingsKeyDetails).map(([, setting]) => (
          <SingleSetting
            key={setting.key}
            setting={setting}
            currentValue={settings.get(setting.key)?.value}
            triggerRefresh={settingsQuery.refetch}
          />
        ))}
      </TableBody>
    </Table>
  );
}

interface SingleSettingProps {
  setting: KeyDescription;
  currentValue: string | undefined;
  triggerRefresh?: () => void;
}
function SingleSetting({
  setting,
  currentValue,
  triggerRefresh,
}: SingleSettingProps) {
  const [isEditMode, setEditMode] = useState(false);
  const [unsavedVal, setUnsavedVal] = useState(currentValue);

  const settingSetMutation = trpcRQ.settings.set.useMutation({
    onSuccess() {
      triggerRefresh?.();
      setEditMode(false);
      toast(`${setting.name} has been saved!`);
    },
    onError(error) {
      console.error(error);
      toast(`Failed to save ${setting.name}`);
    },
  });

  return (
    <TableRow key={setting.key}>
      <TableCell>{setting.name}</TableCell>

      <TableCell className="text-center">
        {isEditMode ? (
          <Input
            value={unsavedVal}
            onChange={(e) => setUnsavedVal(e.target.value)}
            autoFocus
          />
        ) : (
          <span>{currentValue ?? "-"}</span>
        )}
      </TableCell>

      <TableCell className="flex justify-between space-x-1">
        {isEditMode ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    onClick={() =>
                      settingSetMutation.mutate({
                        key: setting.key,
                        value: unsavedVal ?? "",
                      })
                    }
                    isLoading={settingSetMutation.isLoading}
                  >
                    <IoSaveOutline />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Save changes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditMode(false);
                      setUnsavedVal(currentValue);
                    }}
                  >
                    <IoClose />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Cancel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditMode(true)}
                >
                  <CiEdit />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Change the value</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </TableCell>
    </TableRow>
  );
}
