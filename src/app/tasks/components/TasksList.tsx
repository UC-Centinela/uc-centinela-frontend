"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Calendar, Clock, User, LogOut, LogIn } from "lucide-react";

export default function TasksList() {
  const [activeTab, setActiveTab] = useState("assigned");
  const [userSession, setUserSession] = useState<{ isAuthenticated: boolean, role?: string }>({ 
    isAuthenticated: false 
  });
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      // Function to fetch user data from GraphQL API
      const fetchUserData = async (email: string, token: string) => {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              query: `
                query GetUserByEmail($email: String!) {
                  getUserByEmail(email: $email) {
                    id
                    firstName
                    lastName
                    email
                    customerId
                    role
                    idpId
                    rut
                  }
                }
              `,
              variables: {
                email: email
              }
            })
          });
          
          const result = await response.json();
          
          if (result.data?.getUserByEmail?.role) {
            // Store role in localStorage
            localStorage.setItem('userRole', result.data.getUserByEmail.role);
            setUserSession({ 
              isAuthenticated: true, 
              role: result.data.getUserByEmail.role 
            });
            console.log('User role:', result.data.getUserByEmail.role);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      // Check for Auth0 session using the server API endpoint
      const checkAuth0Session = async () => {
        try {
          // Fetch session data from our API endpoint
          const response = await fetch('/api/session');
          
          if (response.ok) {
            const session = await response.json();
            
            if (session && session.user && session.user.email) {
              // Store email in localStorage
              localStorage.setItem('userEmail', session.user.email);
              
              // Get access token from session
              const accessToken = session.tokenSet?.accessToken;
              console.log('Access token:', accessToken ? 'Available' : 'Not available');
              
              if (accessToken) {
                // Store access token in localStorage
                localStorage.setItem('accessToken', accessToken);
                
                // Fetch user data from GraphQL API
                await fetchUserData(session.user.email, accessToken);
              }
              
              setUserSession({ isAuthenticated: true });
            } else {
              setUserSession({ isAuthenticated: false });
            }
          } else {
            setUserSession({ isAuthenticated: false });
          }
        } catch (error) {
          console.error('Error checking Auth0 session:', error);
          setUserSession({ isAuthenticated: false });
        }
      };

      checkAuth0Session();
    }
  }, []);

  const tasks = [
    {
      id: 1,
      title:
        "Posicionamiento de cable minero eléctrico sobre el pretil utilizando equipo de apoyo",
      status: "assigned",
      assignmentDate: "8/02/25",
      requiredDate: "12/02/25",
    },
    {
      id: 2,
      title: "Depositación hidráulica de arenas (Tranque Mauro)",
      status: "assigned",
      assignmentDate: "8/02/25",
      requiredDate: "12/02/25",
    },
    {
      id: 3,
      title:
        "Operación carga, traslado y descarga de material con camión tolva (fuera de botadero de ripios)",
      status: "review",
      assignmentDate: "8/02/25",
      requiredDate: "12/02/25",
    },
    {
      id: 4,
      title:
        "Posicionamiento de cable minero eléctrico sobre el pretil utilizando equipo de apoyo",
      status: "assigned",
      assignmentDate: "8/02/25",
      requiredDate: "12/02/25",
    },
  ];

  const filteredTasks = tasks.filter((task) => task.status === activeTab);

  const getStatusName = () => {
    if (activeTab === "assigned") return "asignadas";
    if (activeTab === "review") return "en revisión";
    return "aprobadas";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 pb-2 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-teal-700 mt-4">
          Tareas asignadas
        </h1>
        <div className="flex gap-2 mt-4">
          <button className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="h-5 w-5 text-teal-700" />
          </button>
          {userSession.isAuthenticated ? (
            <a 
              href="/auth/logout" 
              className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center"
              onClick={() => {
                // Clean up localStorage before redirecting to logout
                localStorage.removeItem('userEmail');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userRole');
              }}
            >
              <LogOut className="h-5 w-5 text-teal-700" />
            </a>
          ) : (
            <a href="/signin" className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <LogIn className="h-5 w-5 text-teal-700" />
            </a>
          )}
        </div>
      </div>
      <div className="px-4 border-b bg-gray-100">
        <div className="flex text-sm justify-center">
          <button
            className={`py-3 px-4 ${
              activeTab === "assigned"
                ? "border-b-2 border-teal-700 font-medium text-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("assigned")}
          >
            Asignadas
          </button>
          <button
            className={`py-3 px-4 ${
              activeTab === "review"
                ? "border-b-2 border-teal-700 font-medium text-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("review")}
          >
            En Revisión
          </button>
          <button
            className={`py-3 px-4 ${
              activeTab === "approved"
                ? "border-b-2 border-teal-700 font-medium text-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("approved")}
          >
            Aprobadas
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-medium text-teal-700 mb-3">
                {task.title}
              </h2>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Fecha Asignación: {task.assignmentDate}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Fecha Requerida Envío: {task.requiredDate}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => router.push(`/tasks/${task.id}`)}
                  className="text-sm text-red-400 flex items-center hover:text-red-600 transition"
                >
                  Ver Detalles <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No tienes tareas {getStatusName()}
          </div>
        )}
      </div>
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => router.push("/tasks/item")}
          className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transition hover:bg-red-700"
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
