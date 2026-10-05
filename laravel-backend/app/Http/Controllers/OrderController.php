<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('user');

        if (!$request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json(
            $query->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'location' => ['required', 'string'],
            'email' => ['required', 'email'],
            'detail' => ['nullable', 'string'],
        ]);

        $data['user_id'] = $request->user()?->id;

        $order = Order::create($data);

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json(
            $order->load('user')
        );
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:30'],
            'location' => ['sometimes', 'string'],
            'email' => ['sometimes', 'email'],
            'detail' => ['sometimes', 'string'],
        ]);

        $order->update($data);

        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully.',
        ]);
    }
}