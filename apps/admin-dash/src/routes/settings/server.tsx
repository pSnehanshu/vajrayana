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
import { Button, FileButton } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormEvent, useRef, useState, useMemo } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logo from "@/assets/images/logo.png";

export const Route = createFileRoute("/settings/server")({
  component: OrgSettings,
});

function OrgSettings() {
  const [{ settings }] = trpcRQ.settings.get.useSuspenseQuery({
    keys: "all",
  });
  const utils = trpcRQ.useUtils();

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
            triggerRefresh={utils.settings.get.invalidate}
          />
        ))}
      </TableBody>
    </Table>
  );
}

interface SingleSettingProps {
  setting: KeyDescription;
  currentValue: string | undefined;
  triggerRefresh: () => void;
}
function SingleSetting({
  setting,
  currentValue,
  triggerRefresh,
}: SingleSettingProps) {
  const [isEditMode, setEditMode] = useState(false);
  const [unsavedValue, setUnsavedVal] = useState(currentValue);
  const formRef = useRef<HTMLFormElement>(null);

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

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    settingSetMutation.mutate({
      key: setting.key,
      value: unsavedValue ?? "",
    });
  }

  const SettingComp: React.FC<SettingItemProps> = useMemo(() => {
    switch (setting.key) {
      case "logoB64":
        return LogoSetting;
      default:
        return TextSetting;
    }
  }, [setting.key]);

  return (
    <TableRow key={setting.key}>
      <TableCell>{setting.name}</TableCell>

      <TableCell>
        <form ref={formRef} onSubmit={handleSave}>
          <div className="flex flex-col items-center space-y-2">
            <SettingComp
              onChange={setUnsavedVal}
              value={currentValue}
              unsavedValue={unsavedValue}
              isEditMode={isEditMode}
            />
          </div>
        </form>
      </TableCell>

      <TableCell className="flex justify-end space-x-1">
        {isEditMode ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => formRef.current?.requestSubmit()}
                  isLoading={settingSetMutation.isLoading}
                >
                  <IoSaveOutline />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Save changes</p>
              </TooltipContent>
            </Tooltip>

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
          </>
        ) : (
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
        )}
      </TableCell>
    </TableRow>
  );
}

interface SettingItemProps {
  value: string | undefined;
  unsavedValue: string | undefined;
  isEditMode: boolean;
  onChange: (val: string) => void;
}

function LogoSetting(props: SettingItemProps) {
  const handleFileChoose = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Convert file to base64 and set form value

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (event) {
        const base64String = event.target?.result;

        if (!base64String) {
          // form.setError("logo", {
          //   message: "Failed to encode in Base64",
          // });
          return;
        }

        if (typeof base64String !== "string") {
          // form.setError("logo", {
          //   message: "Could not get string type",
          // });
          return;
        }

        props.onChange(base64String);
      };
    }
  };

  if (props.isEditMode) {
    return (
      <>
        <img className="max-h-10" src={props.unsavedValue ?? logo} />
        <FileButton value="" accept="image/*" onChange={handleFileChoose} />
      </>
    );
  }

  return <img className="max-h-10" src={props.value ?? logo} />;
}

function TextSetting(props: SettingItemProps) {
  if (props.isEditMode) {
    return (
      <Input
        value={props.unsavedValue}
        onChange={(e) => props.onChange(e.target.value)}
        autoFocus
      />
    );
  }

  return <span>{props.value ?? "-"}</span>;
}
