import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComingSoonTooltipProps {
  children: React.ReactNode;
  title?: string;
}

const ComingSoonTooltip = ({
  children,
  title = "Coming soon",
}: ComingSoonTooltipProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ComingSoonTooltip;
