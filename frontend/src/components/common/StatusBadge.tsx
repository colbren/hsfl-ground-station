import { Chip } from "@mui/material";

interface Props {
    status: string;
}

export default function StatusBadge({ status }: Props) {

    const normalized = status.toLowerCase();

    let color: "success" | "error" | "warning" | "default" = "default";

    if (
        normalized === "online" ||
        normalized === "scheduled" ||
        normalized === "running"
    ) {
        color = "success";
    }

    if (
        normalized === "offline" ||
        normalized === "conflict" ||
        normalized === "failed"
    ) {
        color = "error";
    }

    if (
        normalized === "maintenance" ||
        normalized === "pending"
    ) {
        color = "warning";
    }

    if (
        normalized === "completed" ||
        normalized === "complete"
    ) {
        color = "default";
    }

    return (
        <Chip
            label={status}
            color={color}
            size="small"
        />
    );
}