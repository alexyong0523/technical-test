<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\ApiDataController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/upload', function (Request $request) {
    // Validate the request
    $request->validate([
        'image' => 'required|image|mimes:jpg,png,jpeg,gif|max:2048'
    ]);

    // Get the uploaded file
    $file = $request->file('image');

    // Get the original filename
    $originalFilename = $file->getClientOriginalName();

    // Append a unique identifier to the filename to avoid conflicts
    $filename = pathinfo($originalFilename, PATHINFO_FILENAME); // Get filename without extension
    $extension = $file->getClientOriginalExtension(); // Get file extension
    $uniqueFilename = $filename . '_' . time() . '.' . $extension; // Append timestamp

    // Store the file with the unique filename
    $path = $file->storeAs('uploads', $uniqueFilename, 'public');

    return response()->json([
        'message' => 'Image uploaded successfully',
        'path' => $path,
        'filename' => $uniqueFilename,
    ]);
});

Route::get('/fetch-api-data', [ApiDataController::class, 'fetchApiData']);
Route::post('/store-api-data', [ApiDataController::class, 'storeApiData']);
