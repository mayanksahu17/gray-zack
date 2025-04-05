"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Calendar, Filter, MoreHorizontal, Plus, RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { toast, useToast } from "@/components/ui/use-toast";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios'



// Define enum for room types
enum RoomType {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
  ACCESSIBLE = 'Accessible'
}

// Define enum for room status
enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning',
  OUT_OF_ORDER = 'out of order'
}

// Room interface
export interface IRoomDocument  {
  hotelId: string;
  roomNumber: string;
  type: RoomType;
  floor: number;
  beds: string,
  capacity: number;
  amenities: string[];
  pricePerNight: number;
  status: RoomStatus;
  lastCleaned: Date;
  createdAt: Date;
  updatedAt: Date;
}


const API_BASE_URL = "http://localhost:8000/api/v1/room";
const DEFAULT_HOTEL_ID = "60d21b4667d0d8992e610c85";


export function RoomManagementView() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const [limit, setLimit] = useState(30);
  const [statusCount, setStatusCount] = useState({
    available: 0,
    occupied: 0,
    cleaning: 0,
    maintenance: 0,
    outOfOrder: 0,
  });
  const [selectedTab, setSelectedTab] = useState("all");
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  const [isEditRoomDialogOpen, setIsEditRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: "",
    type: "standard",
    floor: 1,
    beds: "1 Queen",
    capacity: 2,
    amenities: ["WiFi", "TV"],
    pricePerNight: 99.99,
    status: "available",
  });

  // Fetch rooms with filters
  const fetchRooms = async (page = currentPage ) => {
    setIsLoading(true);
    try {
      let queryParams = new URLSearchParams();
      queryParams.append("hotelId", DEFAULT_HOTEL_ID);
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      if (filterFloor !== "all") {
        queryParams.append("floor", filterFloor);
      }

      if (filterType !== "all") {
        queryParams.append("type", filterType);
      }

      if (selectedTab !== "all" && selectedTab !== filterStatus) {
        // If tab selection is different from filter dropdown
        queryParams.append("status", selectedTab);
      } else if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }

      const response = await axios.get(`${API_BASE_URL}?${queryParams.toString()}`);
      
      setRooms(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalRooms(response.data.totalRooms);
      setCurrentPage(page);
      
      // Update status counts
      countRoomsByStatus(response.data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Count rooms by status for statistics
  const countRoomsByStatus = (roomsData : any) => {
    const counts = {
      available: 0,
      occupied: 0,
      cleaning: 0,
      maintenance: 0,
      outOfOrder: 0,
    };

    roomsData.forEach((room)  => {
      const status : string = room.status.toLowerCase().replace(/\s+/g, "");
      if (counts.hasOwnProperty(status)) {
        
        counts[status]++;
      }
    });

    setStatusCount(counts);
  };

  // Initial data load
  useEffect(() => {
    fetchRooms(1);
  }, [selectedTab]);

  // Apply filters
  const applyFilters = () => {
    fetchRooms(1);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterFloor("all");
    setFilterType("all");
    setFilterStatus("all");
    setSelectedTab("all");
    fetchRooms(1);
  };

  // Handle search
  const handleSearch = (e : any) => {
    e.preventDefault();
    fetchRooms(1);
  };

  // Handle page change
  const handlePageChange = (newPage : any) => {
    fetchRooms(newPage);
  };

  // Create a new room
  const createRoom = async () => {
    try {
      const roomData = {
        ...newRoomData,
        hotelId: DEFAULT_HOTEL_ID,
      };

      const response = await axios.post(API_BASE_URL, roomData);
      
      toast({
        title: "Success",
        description: "Room created successfully",
      });
      
      // Refresh the room list
      fetchRooms(currentPage);
      setIsAddRoomDialogOpen(false);
      
      // Reset form data
      setNewRoomData({
        roomNumber: "",
        type: "standard",
        floor: 1,
        beds: "1 Queen",
        capacity: 2,
        amenities: ["WiFi", "TV"],
        pricePerNight: 99.99,
        status: "available",
      });
    } catch (error : any) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create room",
        variant: "destructive",
      });
    }
  };

  // Update room
  const updateRoom = async () => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${selectedRoom._id}`,
        selectedRoom
      );
      
      toast({
        title: "Success",
        description: "Room updated successfully",
      });
      
      fetchRooms(currentPage);
      setIsEditRoomDialogOpen(false);
    } catch (error : any) {
      console.error("Error updating room:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update room",
        variant: "destructive",
      });
    }
  };

  // Update room status
  const updateRoomStatus = async (id :any, status:any) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status`, {
        status,
      });
      
      toast({
        title: "Success",
        description: `Room status updated to ${status}`,
      });
      
      fetchRooms(currentPage);
    } catch (error:any) {
      console.error("Error updating room status:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update room status",
        variant: "destructive",
      });
    }
  };

  // Mark room as cleaned
  const markRoomAsCleaned = async (id :any) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/clean`);
      
      toast({
        title: "Success",
        description: "Room marked as cleaned and now available",
      });
      
      fetchRooms(currentPage);
    } catch (error:any) {
      console.error("Error marking room as cleaned:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark room as cleaned",
        variant: "destructive",
      });
    }
  };

  // Delete room
  const deleteRoom = async (id:any) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      
      fetchRooms(currentPage);
    } catch (error:any) {
      console.error("Error deleting room:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status:any) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "cleaning":
        return "bg-yellow-500";
      case "maintenance":
        return "bg-blue-500";
      case "out of order":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderGridView = () => {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {rooms.map((room ) => (
          <Card key={room._id} className="overflow-hidden">
            <div className={`h-2 w-full ${getStatusColor(room.status)}`} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold">Room {room.roomNumber}</div>
                  <div className="text-sm text-muted-foreground">{room.type}</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Room Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      setSelectedRoom(room);
                      setIsEditRoomDialogOpen(true);
                    }}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRoomStatus(room._id, "cleaning")}>
                      Mark as Cleaning
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRoomStatus(room._id, "maintenance")}>
                      Mark as Maintenance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRoomStatus(room._id, "available")}>
                      Mark as Available
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => updateRoomStatus(room._id, "out of order")} className="text-red-500">
                      Mark as Out of Order
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteRoom(room._id)} className="text-red-500">
                      Delete Room
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Floor:</span>
                  <span>{room.floor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{room.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Beds:</span>
                  <span>{room.beds}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>${room.pricePerNight}/night</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">{room.status}</span>
                </div>
                {room.status.toLowerCase() === "occupied" && (
                  <div className="flex justify-between">
                    <span>Guest:</span>
                    <span>{room.guest || "Unknown"}</span>
                  </div>
                )}
                {room.status.toLowerCase() === "occupied" && room.checkout && (
                  <div className="flex justify-between">
                    <span>Checkout:</span>
                    <span>{new Date(room.checkout).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                {room.status.toLowerCase() === "available" ? (
                  <Button size="sm" className="flex-1" onClick={() => updateRoomStatus(room._id, "occupied")}>
                    Assign
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1" onClick={() => {
                    setSelectedRoom(room);
                    setIsEditRoomDialogOpen(true);
                  }}>
                    Details
                  </Button>
                )}
                {room.status.toLowerCase() === "occupied" ? (
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => updateRoomStatus(room._id, "cleaning")}>
                    Checkout
                  </Button>
                ) : room.status.toLowerCase() === "cleaning" ? (
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => markRoomAsCleaned(room._id)}>
                    Mark Clean
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                    setSelectedRoom(room);
                    setIsEditRoomDialogOpen(true);
                  }}>
                    Update
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="rounded-md border">
        <div className="grid grid-cols-8 border-b bg-muted p-3 text-sm font-medium">
          <div>Room</div>
          <div>Type</div>
          <div>Floor</div>
          <div>Beds</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y">
          {rooms.map((room : any) => (
            <div key={room._id} className="grid grid-cols-8 items-center p-3 text-sm">
              <div className="font-medium">Room {room.roomNumber}</div>
              <div>{room.type}</div>
              <div>{room.floor}</div>
              <div>{room.beds}</div>
              <div>{room.capacity}</div>
              <div>${room.pricePerNight}</div>
              <div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(room.status)}`} />
                  <span>{room.status}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {room.status.toLowerCase() === "available" ? (
                  <Button size="sm" onClick={() => updateRoomStatus(room._id, "occupied")}>
                    Assign
                  </Button>
                ) : room.status.toLowerCase() === "cleaning" ? (
                  <Button size="sm" onClick={() => markRoomAsCleaned(room._id)}>
                    Mark Clean
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => {
                    setSelectedRoom(room);
                    setIsEditRoomDialogOpen(true);
                  }}>
                    Details
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Room Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      setSelectedRoom(room);
                      setIsEditRoomDialogOpen(true);
                    }}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRoomStatus(room._id, "cleaning")}>
                      Mark as Cleaning
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRoomStatus(room._id, "maintenance")}>
                      Mark as Maintenance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRoomStatus(room._id, "available")}>
                      Mark as Available
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => updateRoomStatus(room._id, "out of order")} className="text-red-500">
                      Mark as Out of Order
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteRoom(room._id)} className="text-red-500">
                      Delete Room
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Add Room Dialog
  const renderAddRoomDialog = () => {
    return (
      <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Enter the details for the new room.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={newRoomData.roomNumber}
                  onChange={(e) => setNewRoomData({ ...newRoomData, roomNumber: e.target.value })}
                  placeholder="101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  type="number"
                  value={newRoomData.floor}
                  onChange={(e) => setNewRoomData({ ...newRoomData, floor: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Room Type</Label>
                <Select
                  value={newRoomData.type}
                  onValueChange={(value) => setNewRoomData({ ...newRoomData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="beds">Beds</Label>
                <Select
                  value={newRoomData.beds}
                  onValueChange={(value) => setNewRoomData({ ...newRoomData, beds: value })}
                >
                  <SelectTrigger id="beds">
                    <SelectValue placeholder="Select beds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 King">1 King</SelectItem>
                    <SelectItem value="1 Queen">1 Queen</SelectItem>
                    <SelectItem value="2 Queen">2 Queen</SelectItem>
                    <SelectItem value="2 Twin">2 Twin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newRoomData.capacity}
                  onChange={(e) => setNewRoomData({ ...newRoomData, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerNight">Price Per Night ($)</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  step="0.01"
                  value={newRoomData.pricePerNight}
                  onChange={(e) => setNewRoomData({ ...newRoomData, pricePerNight: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newRoomData.status}
                onValueChange={(value) => setNewRoomData({ ...newRoomData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out of order">Out of Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {["WiFi", "TV", "Mini-bar", "Coffee maker", "Iron", "Hair dryer", "Safe", "Balcony"].map((amenity) => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={newRoomData.amenities?.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (newRoomData.amenities?.includes(amenity)) {
                        setNewRoomData({
                          ...newRoomData,
                          amenities: newRoomData.amenities.filter((a) => a !== amenity),
                        });
                      } else {
                        setNewRoomData({
                          ...newRoomData,
                          amenities: [...(newRoomData.amenities || []), amenity],
                        });
                      }
                    }}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoomDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createRoom}>
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Edit Room Dialog
  const renderEditRoomDialog = () => {
    if (!selectedRoom) return null;
    
    return (
      <Dialog open={isEditRoomDialogOpen} onOpenChange={setIsEditRoomDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
            <DialogDescription>
              View and edit room information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-roomNumber">Room Number</Label>
                <Input
                  id="edit-roomNumber"
                  value={selectedRoom.roomNumber}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, roomNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-floor">Floor</Label>
                <Input
                  id="edit-floor"
                  type="number"
                  value={selectedRoom.floor}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, floor: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Room Type</Label>
                <Select
                  value={selectedRoom.type}
                  onValueChange={(value) => setSelectedRoom({ ...selectedRoom, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-beds">Beds</Label>
                <Select
                  value={selectedRoom.beds}
                  onValueChange={(value) => setSelectedRoom({ ...selectedRoom, beds: value })}
                >
                  <SelectTrigger id="edit-beds">
                    <SelectValue placeholder="Select beds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 King">1 King</SelectItem>
                    <SelectItem value="1 Queen">1 Queen</SelectItem>
                    <SelectItem value="2 Queen">2 Queen</SelectItem>
                    <SelectItem value="2 Twin">2 Twin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={selectedRoom.capacity}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pricePerNight">Price Per Night ($)</Label>
                <Input
                  id="edit-pricePerNight"
                  type="number"
                  step="0.01"
                  value={selectedRoom.pricePerNight}
                  onChange={(e) => setSelectedRoom({ ...selectedRoom, pricePerNight: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={selectedRoom.status}
                onValueChange={(value) => setSelectedRoom({ ...selectedRoom, status: value })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out of order">Out of Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {["WiFi", "TV", "Mini-bar", "Coffee maker", "Iron", "Hair dryer", "Safe", "Balcony"].map((amenity) => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={selectedRoom.amenities?.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedRoom.amenities?.includes(amenity)) {
                        setSelectedRoom({
                          ...selectedRoom,
                          amenities: selectedRoom.amenities.filter((a) => a !== amenity),
                        });
                      } else {
                        setSelectedRoom({
                          ...selectedRoom,
                          amenities: [...(selectedRoom.amenities || []), amenity],
                        });
                      }
                    }}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>
            {selectedRoom.status.toLowerCase() === "cleaning" && (
              <div className="mt-4">
                <Button 
                  onClick={() => {
                    markRoomAsCleaned(selectedRoom._id);
                    setIsEditRoomDialogOpen(false);
                  }}
                  className="w-full"
                  >
                  Mark Room as Cleaned
                </Button>
              </div>
            )}
            {selectedRoom.lastCleaned && (
              <div className="text-sm text-muted-foreground">
                Last cleaned: {new Date(selectedRoom.lastCleaned).toLocaleString()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoomDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                deleteRoom(selectedRoom._id);
                setIsEditRoomDialogOpen(false);
              }}
            >
              Delete
            </Button>
            <Button onClick={updateRoom}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Pagination component
  const renderPagination = () => {
    return (
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {rooms.length} of {totalRooms} rooms | Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming soon: View room bookings in calendar format</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button className="gap-2" onClick={() => setIsAddRoomDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Add Room</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Room Status Overview</CardTitle>
          <CardDescription>Current room availability and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-lg bg-green-100 p-4 text-center dark:bg-green-900">
              <div className="text-sm font-medium text-green-800 dark:text-green-100">Available</div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-100">{statusCount.available}</div>
            </div>
            <div className="rounded-lg bg-red-100 p-4 text-center dark:bg-red-900">
              <div className="text-sm font-medium text-red-800 dark:text-red-100">Occupied</div>
              <div className="text-2xl font-bold text-red-800 dark:text-red-100">{statusCount.occupied}</div>
            </div>
            <div className="rounded-lg bg-yellow-100 p-4 text-center dark:bg-yellow-900">
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-100">Cleaning</div>
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">{statusCount.cleaning}</div>
            </div>
            <div className="rounded-lg bg-blue-100 p-4 text-center dark:bg-blue-900">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-100">Maintenance</div>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-100">{statusCount.maintenance}</div>
            </div>
            <div className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">Out of Order</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{statusCount.outOfOrder}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form onSubmit={handleSearch} className="flex w-full max-w-sm gap-2">
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            <div>
              <Label htmlFor="floor-filter" className="sr-only">
                Floor
              </Label>
              <Select value={filterFloor} onValueChange={setFilterFloor}>
                <SelectTrigger id="floor-filter" className="w-[120px]">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  <SelectItem value="1">1st Floor</SelectItem>
                  <SelectItem value="2">2nd Floor</SelectItem>
                  <SelectItem value="3">3rd Floor</SelectItem>
                  <SelectItem value="4">4th Floor</SelectItem>
                  <SelectItem value="5">5th Floor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type-filter" className="sr-only">
                Room Type
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="type-filter" className="w-[150px]">
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter" className="sr-only">
                Status
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status-filter" className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out of order">Out of Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" onClick={applyFilters}>
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={resetFilters}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Rooms</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="occupied">Occupied</TabsTrigger>
            <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="out of order">Out of Order</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex justify-end">
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                {/* <Grid className="h-4 w-4 mr-1" /> */}
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                {/* <List className="h-4 w-4 mr-1" /> */}
                List
              </Button>
            </div>
          </div>
          <TabsContent value={selectedTab} className="mt-2">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : rooms.length > 0 ? (
              <>
                {viewMode === "grid" ? renderGridView() : renderListView()}
                {renderPagination()}
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No rooms found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddRoomDialogOpen(true)}
                >
                  Add a New Room
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Render dialogs */}
      {renderAddRoomDialog()}
      {renderEditRoomDialog()}
    </div>
  );
}

// Helper function to format price
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
}

// Helper function to capitalize first letter
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}