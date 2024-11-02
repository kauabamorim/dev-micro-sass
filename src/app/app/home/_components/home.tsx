"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getCookieValue } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Film, ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function HomeForm() {
  const [user, setUser] = useState<User | null>(null);

  interface Post {
    id: number;
    username: string;
    handle: string | undefined;
    content: string;
    image: string | null;
    timestamp: string;
  }
  interface Movie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    overview: string;
  }

  interface MovieResponse {
    results: Movie[];
    total_pages: number;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookieValue("token");

      if (token) {
        try {
          const decoded = await verifyToken(token);
          if (decoded) {
            const response = await fetch(`/api/user/${decoded.id}`);
            const data = await response.json();
            setUser(data);
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      } else {
        console.error("No token found in cookies");
      }
    };

    fetchUser();
  }, []);

  const fetchMovies = async (page: number) => {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=${page}&sort_by=popularity.desc`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.THEMOVIESDB_API_KEY}` || "",
      },
    };

    try {
      const response = await fetch(url, options);
      const data: MovieResponse = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-background border-b px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-6 w-6 rounded-full" />
            <span className="sr-only">Acme Social</span>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </nav>
        </header>
        <main className="flex-1 animate-pulse p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 rounded w-1/4" />
            <Skeleton className="h-6 rounded w-1/3" />
            <Skeleton className="h-6 rounded w-1/2" />
            <Skeleton className="h-6 rounded w-3/4" />
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies && movies.length > 0 ? (
              movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/placeholder.svg?height=750&width=500"
                    }
                    alt={movie.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {movie.title}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      {formatDate(movie.release_date)}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {movie.overview || "Nenhuma descrição disponível."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhum filme encontrado.</p>
            )}
          </div>
          <div className="mt-8 flex justify-center items-center space-x-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2" />
              Anterior
            </Button>
            <span className="text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Próxima
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
