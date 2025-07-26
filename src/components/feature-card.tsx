import { createElement, FunctionComponent } from "react";
import { Balancer } from 'react-wrap-balancer'

export default function FeatureCard(props: {
    icon: FunctionComponent<{ className?: string }>,
    title: string,
    description: string
}) {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#70C7BA]/50 transition-all duration-300 group text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto">
                {createElement(props.icon, {
                    className: "w-6 h-6 text-white"
                })}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{props.title}</h3>
            <p className="text-gray-400"><Balancer>{props.description}</Balancer></p>
        </div>
    )
}