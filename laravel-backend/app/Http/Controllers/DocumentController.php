<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


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
            'order_id'   => ['nullable', 'exists:orders,id'],
            'payment_id' => ['nullable', 'exists:payments,id'],
            'package_id' => ['nullable', 'exists:packages,id'],
            'file'       => ['required', 'file', 'max:10240'],
        ]);

        $ownerCount = collect([
            $data['order_id'] ?? null,
            $data['payment_id'] ?? null,
            $data['package_id'] ?? null,
        ])->filter()->count();

        if ($ownerCount !== 1) {
            return response()->json([
                'message' => 'Document must belong to exactly one order, payment or package.',
            ], 422);
        }

        $file = $request->file('file');

        $disk = 'public';

        $path = $file->store('documents', $disk);

        $document = Document::create([
            'package_id'    => $data['package_id'] ?? null,
            'order_id'      => $data['order_id'] ?? null,
            'payment_id'    => $data['payment_id'] ?? null,
            'disk'          => $disk,
            'path'          => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type'     => $file->getMimeType(),
            'size'          => $file->getSize(),
        ]);

        return response()->json($document, 201);
    }

    public function show(Document $document)
    {
        return response()->json($document);
    }

    public function destroy(Document $document)
    {
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully.',
        ]);
    }

}
