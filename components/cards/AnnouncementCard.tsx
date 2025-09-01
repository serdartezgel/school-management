import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const AnnouncementCard = ({ data }) => {
  return (
    <Card className="bg-sidebar rounded-md p-4">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center justify-between font-medium">
          <span>{data.title}</span>
          <span className="bg-background rounded-md px-1 py-1 text-xs text-gray-500 dark:text-gray-400">
            {new Intl.DateTimeFormat().format(data.date)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 text-sm text-zinc-600 dark:text-zinc-400">
        {data.description}
      </CardContent>
    </Card>
  );
};
export default AnnouncementCard;
