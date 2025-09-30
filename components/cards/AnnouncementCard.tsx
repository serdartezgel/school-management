import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const AnnouncementCard = ({ data }) => {
  return (
    <Card className="bg-primary rounded-md p-4">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center justify-between font-medium">
          <span className="text-white">{data.title}</span>
          <span className="rounded-md px-1 py-1 text-xs text-gray-300">
            {new Intl.DateTimeFormat().format(data.date)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 text-sm text-gray-300">
        {data.description}
      </CardContent>
    </Card>
  );
};
export default AnnouncementCard;
