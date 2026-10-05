<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index()
    {
        return response()->json(
            Document::with(['order', 'payment', 'package'])->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => ['nullable', 'exists:orders,id'],
            'payment_id' => ['nullable', 'exists:payments,id'],
            'package_id' => ['nullable', 'exists:packages,id'],
            'file' => ['required', 'file', 'max:10240'],
        ]);

        if (!$data['order_id'] && !$data['payment_id']) {
            return response()->json([
                'message' => 'Document must belong to an order or payment.',
            ], 422);
        }

        $file = $request->file('file');

        $disk = config('filesystems.default');

        $path = $file->store('documents', $disk);

        $document = Document::create([
            'order_id' => $data['order_id'] ?? null,
            'payment_id' => $data['payment_id'] ?? null,
            'disk' => $disk,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($document, 201);
    }

    public function show(Document $document)
    {
        return response()->json($document);
    }

    public function destroy(Document $document)
    {
        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully.',
        ]);
    }
}