import React from "react";
import { MOCK_REVIEWS } from "../../data/mockData";
import StarRating from "../../components/shared/StarRating";
import { formatDate } from "../../lib/utils";

export default function Feedback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">User Feedback</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Tourist ID</th>
                <th className="px-6 py-3 font-medium">Guide ID</th>
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 font-medium">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_REVIEWS.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {formatDate(review.date)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {review.touristId}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{review.guideId}</td>
                  <td className="px-6 py-4">
                    <StarRating
                      rating={review.rating}
                      showCount={false}
                      size={14}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-md truncate">
                    {review.comment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
