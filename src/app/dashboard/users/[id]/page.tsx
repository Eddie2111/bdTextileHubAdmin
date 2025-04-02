import { useRouter } from "next/navigation";
import { ArrowLeft, Ban, Mail, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserProfileProps {
  params: {
    id: string;
  };
}

export default function UserProfilePage({ params }: UserProfileProps) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const { id } = params;

  // In a real app, you would fetch user data based on the ID
  const [user, setUser] = useState({
    id,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    joinDate: "January 15, 2023",
    status: "active" as "active" | "blocked",
    orders: 12,
    totalSpent: "$1,245.00",
  });

  const toggleUserStatus = () => {
    setUser({
      ...user,
      status: user.status === "active" ? "blocked" : "active",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>View and manage user details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-green-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="h-12 w-12 text-green-600" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Name
                </h3>
                <p className="text-base">{user.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email
                </h3>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{user.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Phone
                </h3>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{user.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Address
                </h3>
                <p className="text-base">{user.address}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Join Date
                </h3>
                <p className="text-base">{user.joinDate}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className={
                user.status === "active" ? "text-red-600" : "text-green-600"
              }
              onClick={toggleUserStatus}
            >
              <Ban className="mr-2 h-4 w-4" />
              {user.status === "active" ? "Block User" : "Unblock User"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>
              User&apos;s order history and statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </h3>
                <p className="text-2xl font-bold">{user.orders}</p>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Spent
                </h3>
                <p className="text-2xl font-bold">{user.totalSpent}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-medium">Recent Orders</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(order => (
                  <div
                    key={order}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">Order #{order + 1000}</p>
                      <p className="text-sm text-muted-foreground">
                        March {order + 10}, 2023
                      </p>
                    </div>
                    <p className="font-medium">${(order * 45).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
