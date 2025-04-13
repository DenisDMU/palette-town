import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Stockage en mémoire simple pour le rate limiting
const API_REQUESTS = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 100; // Requêtes par IP par minute
const WINDOW_MS = 60 * 1000; // 1 minute en millisecondes

export function middleware(request: NextRequest) {
	// N'appliquer qu'aux routes API
	if (request.nextUrl.pathname.startsWith("/api/")) {
		// Récupérer l'IP du client
		const ip = request.headers.get("x-forwarded-for") || "unknown";
		const now = Date.now();

		// Récupérer le compteur actuel pour cette IP
		const rateData = API_REQUESTS.get(ip) || {
			count: 0,
			timestamp: now,
		};

		// Réinitialiser le compteur si la fenêtre est expirée
		if (now - rateData.timestamp > WINDOW_MS) {
			rateData.count = 0;
			rateData.timestamp = now;
		}

		// Incrémenter le compteur
		rateData.count++;
		API_REQUESTS.set(ip, rateData);

		// Vérifier si la limite est dépassée
		if (rateData.count > RATE_LIMIT) {
			console.warn(`Rate limit exceeded for IP: ${ip}`);
			return new NextResponse(
				JSON.stringify({
					error: "Too many requests",
					message: "Please try again later",
				}),
				{
					status: 429,
					headers: {
						"Content-Type":
							"application/json",
						"Retry-After": "60",
						"Access-Control-Allow-Origin":
							"*",
						"Access-Control-Allow-Methods":
							"GET, OPTIONS",
						"Access-Control-Allow-Headers":
							"Content-Type, Authorization",
					},
				}
			);
		}

		// Ajouter des en-têtes CORS pour toutes les réponses API
		const response = NextResponse.next();
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set(
			"Access-Control-Allow-Methods",
			"GET, OPTIONS"
		);
		response.headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization"
		);
		response.headers.set(
			"X-RateLimit-Limit",
			RATE_LIMIT.toString()
		);
		response.headers.set(
			"X-RateLimit-Remaining",
			(RATE_LIMIT - rateData.count).toString()
		);

		return response;
	}

	return NextResponse.next();
}

// Configurer le middleware pour les routes API uniquement
export const config = {
	matcher: "/api/:path*",
};
