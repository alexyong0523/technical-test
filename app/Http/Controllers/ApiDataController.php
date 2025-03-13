<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\ApiData;

class ApiDataController extends Controller
{
    // Fetch API data WITHOUT saving to DB
    public function fetchApiData()
    {
        try {
            $response = Http::get('https://jsonplaceholder.typicode.com/posts?_limit=5');

            if ($response->successful()) {
                return response()->json($response->json());
            }
            return response()->json(['error' => 'Failed to fetch API data'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Store data into DB after user edits
    public function storeApiData(Request $request)
    {
        try {
            $post = ApiData::create([
                'title' => $request->title,
                'body' => $request->body,
            ]);

            return response()->json(['message' => 'Data saved successfully', 'post' => $post]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
